import base44 from "../base44_client.ts";

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || (await req.json().catch(() => ({}))).action;
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const act = action || body.action;

  const db = base44.asServiceRole.entities;

  try {
    // === FACTURAS ===
    if (act === "list_invoices") {
      const invoices = await db.Invoice.list({ limit: 200, sort: "-created_date" });
      return ok(invoices);
    }

    if (act === "create_invoice") {
      const inv = await db.Invoice.create(body.data);
      // Incrementar siguiente número en config
      const cfgs = await db.InvoiceConfig.list({ limit: 1 });
      if (cfgs.items?.length) {
        const cfg = cfgs.items[0];
        await db.InvoiceConfig.update(cfg.id, { siguiente_numero: (cfg.siguiente_numero || 1) + 1 });
      }
      return ok(inv);
    }

    if (act === "update_invoice") {
      const inv = await db.Invoice.update(body.id, body.data);
      return ok(inv);
    }

    if (act === "delete_invoice") {
      await db.Invoice.delete(body.id);
      return ok({ deleted: true });
    }

    // === CLIENTES ===
    if (act === "list_clients") {
      const clients = await db.InvoiceClient.list({ limit: 200, sort: "nombre" });
      return ok(clients);
    }

    if (act === "create_client") {
      const client = await db.InvoiceClient.create(body.data);
      return ok(client);
    }

    if (act === "update_client") {
      const client = await db.InvoiceClient.update(body.id, body.data);
      return ok(client);
    }

    if (act === "delete_client") {
      await db.InvoiceClient.delete(body.id);
      return ok({ deleted: true });
    }

    // === CONFIG ===
    if (act === "get_config") {
      const cfgs = await db.InvoiceConfig.list({ limit: 1 });
      if (cfgs.items?.length) return ok(cfgs.items[0]);
      // Crear config default
      const def = await db.InvoiceConfig.create({
        razon_social: "Mi Empresa S.A. de C.V.",
        rfc: "",
        direccion: "",
        email: "",
        telefono: "",
        website: "",
        footer: "Gracias por su preferencia.",
        iva_default: 16,
        prefijo_folio: "INV-",
        siguiente_numero: 1,
        dias_credito: 30,
        color_principal: "#1B2D3E",
        color_acento: "#2BA99B",
        plantilla_default: "modern",
        claude_model: "claude-opus-4-5"
      });
      return ok(def);
    }

    if (act === "save_config") {
      const cfgs = await db.InvoiceConfig.list({ limit: 1 });
      let cfg;
      if (cfgs.items?.length) {
        cfg = await db.InvoiceConfig.update(cfgs.items[0].id, body.data);
      } else {
        cfg = await db.InvoiceConfig.create(body.data);
      }
      return ok(cfg);
    }

    // === MULTI-AGENTE ORQUESTADOR ===
    if (act === "orchestrate") {
      const { userMessage, currentAgent, history, claudeApiKey, claudeModel, invoiceContext } = body;

      if (!claudeApiKey) {
        return ok({ reply: "⚠️ Configura tu API Key de Claude en Configuración para activar los agentes.", agent: currentAgent });
      }

      const PROMPTS: Record<string, string> = {
        creador: `Eres el Agente Creador de Invoice OS. Cuando el usuario describa un servicio o venta:
1. Extrae: nombre del cliente, RFC si lo menciona, conceptos/servicios, cantidades, precios unitarios
2. Calcula subtotal, IVA (16% por defecto), total
3. Sugiere número de factura con prefijo INV- y fecha de vencimiento a 30 días
4. Responde en español con resumen claro
5. Al final incluye un bloque JSON con esta estructura EXACTA (solo si tienes suficiente info):
---JSON_FACTURA---
{"cliente_nombre":"...","cliente_rfc":"...","conceptos":[{"desc":"...","qty":1,"precio":0}],"notas":"..."}
---FIN_JSON---`,

        revisor: `Eres el Agente Revisor de Invoice OS, experto fiscal mexicano.
Valida los datos de la factura y responde en español con:
✅ OK — campo correcto
⚠️ Advertencia — revisar pero no crítico  
❌ Error — debe corregirse antes de emitir
Revisa: formato RFC (12-13 chars alfanuméricos), montos coherentes, IVA correcto, fechas válidas, conceptos con descripción clara.`,

        redactor: `Eres el Agente Redactor de Invoice OS.
Mejora las descripciones de servicios para que sean más profesionales y claras.
Sugiere términos de pago apropiados al giro del negocio.
Responde siempre en español con las versiones mejoradas y una breve explicación del cambio.`,

        cobrador: `Eres el Agente Cobrador de Invoice OS.
Genera recordatorios de pago profesionales adaptando el tono según días vencidos:
- Amable y cordial: facturas con 1-14 días de vencimiento
- Firme pero profesional: 15-30 días
- Formal con urgencia: más de 30 días
Responde en español. Incluye referencia al número de factura, monto y fecha de vencimiento.`,

        analitico: `Eres el Agente Analítico de Invoice OS.
Analiza datos de facturación y genera insights de negocio en español.
Identifica: clientes más rentables, patrones de pago, meses con más ingresos, proyecciones.
Usa el contexto de facturas proporcionado para dar análisis específicos y accionables.`
      };

      const systemPrompt = PROMPTS[currentAgent] || PROMPTS.creador;
      const contextMsg = invoiceContext ? `\n\nContexto actual de facturas: ${JSON.stringify(invoiceContext)}` : "";

      const messages = [
        ...(history || []).slice(-8),
        { role: "user", content: userMessage }
      ];

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": claudeApiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: claudeModel || "claude-opus-4-5",
          max_tokens: 4096,
          system: systemPrompt + contextMsg,
          messages
        })
      });

      if (!resp.ok) {
        const err = await resp.json();
        return ok({ reply: `❌ Error Claude: ${err.error?.message || resp.status}`, agent: currentAgent });
      }

      const data = await resp.json();
      const reply = data.content?.[0]?.text || "Sin respuesta";

      // Extraer JSON de factura si el agente creador lo generó
      let invoiceData = null;
      const jsonMatch = reply.match(/---JSON_FACTURA---([\s\S]+?)---FIN_JSON---/);
      if (jsonMatch) {
        try { invoiceData = JSON.parse(jsonMatch[1].trim()); } catch {}
      }

      return ok({ reply, agent: currentAgent, invoiceData });
    }

    return ok({ error: "Acción no reconocida: " + act }, 400);

  } catch (e: any) {
    return ok({ error: e.message }, 500);
  }
}

function ok(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
