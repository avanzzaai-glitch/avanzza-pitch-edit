import base44 from "../base44_client.ts";

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
  }

  let body: any = {};
  try { body = await req.json(); } catch {}
  const act = body.action;
  const db = base44.asServiceRole.entities;

  try {
    // === API KEY — sirve desde env var, nunca expuesta en el HTML ===
    if (act === "get_api_key") {
      const key = Deno.env.get("ANTHROPIC_API_KEY") || "";
      return ok({ key: key ? key : "" });
    }

    // === FACTURAS ===
    if (act === "list_invoices") {
      return ok(await db.Invoice.list({ limit: 200, sort: "-created_date" }));
    }
    if (act === "create_invoice") {
      const inv = await db.Invoice.create(body.data);
      const cfgs = await db.InvoiceConfig.list({ limit: 1 });
      if (cfgs.items?.length) {
        const c = cfgs.items[0];
        await db.InvoiceConfig.update(c.id, { siguiente_numero: (c.siguiente_numero || 1) + 1 });
      }
      return ok(inv);
    }
    if (act === "update_invoice") {
      return ok(await db.Invoice.update(body.id, body.data));
    }
    if (act === "delete_invoice") {
      await db.Invoice.delete(body.id);
      return ok({ deleted: true });
    }

    // === CLIENTES / PROVEEDORES ===
    if (act === "list_clients") {
      return ok(await db.InvoiceClient.list({ limit: 200 }));
    }
    if (act === "create_client") {
      return ok(await db.InvoiceClient.create(body.data));
    }
    if (act === "delete_client") {
      await db.InvoiceClient.delete(body.id);
      return ok({ deleted: true });
    }

    // === CONFIG ===
    if (act === "get_config") {
      const cfgs = await db.InvoiceConfig.list({ limit: 1 });
      if (cfgs.items?.length) return ok(cfgs.items[0]);
      return ok(await db.InvoiceConfig.create({
        razon_social: "Mi Empresa S.A.",
        iva_default: 16, prefijo_folio: "INV-", siguiente_numero: 1,
        dias_credito: 30, color_principal: "#1B2D3E", color_acento: "#2BA99B",
        plantilla_default: "modern", claude_model: "claude-opus-4-5",
        footer: "Gracias por su preferencia."
      }));
    }
    if (act === "save_config") {
      const cfgs = await db.InvoiceConfig.list({ limit: 1 });
      if (cfgs.items?.length) return ok(await db.InvoiceConfig.update(cfgs.items[0].id, body.data));
      return ok(await db.InvoiceConfig.create(body.data));
    }

    // === ORQUESTADOR MULTI-AGENTE ===
    if (act === "orchestrate") {
      const { userMessage, currentAgent, history, claudeApiKey, claudeModel, invoiceContext } = body;
      // Usar key del env si no viene del cliente
      const key = claudeApiKey || Deno.env.get("ANTHROPIC_API_KEY") || "";
      if (!key) return ok({ reply: "⚠️ API Key no configurada. Ve a Configuración → API Keys." });

      const PROMPTS: Record<string, string> = {
        creador: `Eres el Agente Creador de Invoice OS. Extrae datos de factura del mensaje del usuario: cliente, RFC, conceptos, cantidades, precios. Calcula subtotal, IVA 16%, total. Responde en español. Si tienes datos suficientes incluye:\n---JSON_FACTURA---\n{"cliente_nombre":"...","cliente_rfc":"...","conceptos":[{"desc":"...","qty":1,"precio":0}],"notas":"..."}\n---FIN_JSON---`,
        revisor: `Eres el Agente Revisor de Invoice OS. Valida datos fiscales MX. Usa ✅ OK, ⚠️ Advertencia, ❌ Error. Revisa RFC, IVA, montos, fechas. Responde en español.`,
        redactor: `Eres el Agente Redactor. Mejora descripciones de servicios y términos de pago. Responde en español.`,
        cobrador: `Eres el Agente Cobrador. Genera recordatorios de pago profesionales según días vencidos. Tono amable <15 días, firme 15-30, formal >30. Responde en español.`,
        analitico: `Eres el Agente Analítico. Analiza patrones de facturación e identifica clientes rentables. Usa el contexto de facturas. Responde en español con insights accionables.`
      };

      const ctx = invoiceContext ? `\n\nContexto de facturas: ${JSON.stringify(invoiceContext).slice(0, 2000)}` : "";
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: claudeModel || "claude-opus-4-5",
          max_tokens: 2048,
          system: (PROMPTS[currentAgent] || PROMPTS.creador) + ctx,
          messages: [...(history || []).slice(-6), { role: "user", content: userMessage }]
        })
      });
      if (!resp.ok) { const e = await resp.json(); return ok({ reply: `❌ Error: ${e.error?.message || resp.status}` }); }
      const data = await resp.json();
      const reply = data.content?.[0]?.text || "";
      let invoiceData = null;
      const m = reply.match(/---JSON_FACTURA---([\s\S]+?)---FIN_JSON---/);
      if (m) { try { invoiceData = JSON.parse(m[1].trim()); } catch {} }
      return ok({ reply, invoiceData });
    }

    return ok({ error: "Acción no válida: " + act }, 400);
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
