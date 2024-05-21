import http from "k6/http";
import { sleep } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";
import { check, fail } from "k6";

// Definindo métricas personalizadas
export let PostDuration = new Trend("post_duration");
export let PostFailRate = new Rate("post_fail_rate");
export let PostSuccessRate = new Rate("post_success_rate");
export let PostReqs = new Rate("post_reqs");

export default function () {
  let url = "http://localhost:3000/webhook/LifFcuXDWJ";

  let payload = JSON.stringify({
    data: [
      {
        type: "sale",
        event: "saleUpdated",
        oldStatus: "created",
        currentStatus: "paid",
        client: {
          id: 1068697,
          name: "Lucas",
          email: "lucas@greenn.com.br",
          cellphone: "+5544997393135",
          document: "124.819.429-22",
          zipcode: null,
          street: "",
          number: "0",
          complement: "",
          neighborhood: "",
          city: "",
          uf: "",
          created_at: "2023-10-06T21:04:50.000000Z",
          updated_at: "2023-10-06T21:04:50.000000Z",
          document_type: "cpf",
          cpf_cnpj: "090.421.669-16",
        },
        sale: {
          seller_id: 20,
          type: "SUBSCRIPTION",
          method: "CREDIT_CARD",
          subscription_id: "sub_migrated_tYig9PG69u1a0NDSW",
          installments: 1,
          client_id: 1068697,
          status: "paid",
          fee: 4.94,
          seller_balance: 74.06,
          amount: 3220,
          boleto_url: "https://adm.greenn.com.br/redirect/",
          boleto_barcode: null,
          proposal_id: null,
          boleto_expiration_date: null,
          is_smart_sale: 0,
          shipping_amount: null,
          qrcode: null,
          imgQrcode: null,
          updated_at: "2023-12-06T03:44:39.000000Z",
          created_at: "2023-12-06T03:44:39.000000Z",
          id: 1729483,
          paid_at: "2023-12-06T00:57:13.000000Z",
          coupon: null,
        },
        product: {
          id: 483,
          name: "Leads Adicionais (Mensal)",
          description:
            "Leads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads AdicionaisLeads Adicionais",
          type: "SUBSCRIPTION",
          amount: 245,
          period: 30,
          thank_you_page: "https://gdigital.com.br/boas-vindas-gdigital/",
          created_at: "2022-06-29T09:23:20.000000Z",
          updated_at: "2023-08-24T11:15:04.000000Z",
          method: "CREDIT_CARD,BOLETO",
          url_callback: "https://wgapi.innovaweb.com.br/api/greenn",
          trial: null,
          proposal_minimum: 10,
          allow_proposal: 1,
          affiliation_approbation: 0,
          affiliation_public: 0,
          is_active: 1,
          deleted_at: null,
          affiliation_proposal: 0,
        },
        oferta: "Leads Adicionais (Mensal)",
        seller: {
          id: 4,
          name: "GDigital",
          email: "rafael@gdigital.com.br",
          cellphone: "(44) 99985-3225",
        },
        affiliate: null,
        productMetas: {
          gproduto_id: "59",
          gperiod: "1",
          gsec: "empresa",
        },
        proposalMetas: [],
        saleMetas: [],
        sf_trk: null,
        client_has_contract_id: 121160,
      },
    ],
  });

  let params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  for (let i = 0; i < 1000; i++) {
    let res = http.post(url, payload, params);

    // Adicionando dados às métricas
    PostDuration.add(res.timings.duration);
    PostReqs.add(1);
    PostFailRate.add(res.status == 0 || res.status > 399);
    PostSuccessRate.add(res.status < 399);

    // Verificando se a duração está abaixo de um valor máximo (por exemplo, 4 segundos)
    let durationMsg = `Max Duration ${4000 / 1000}s`;
    if (
      !check(res, {
        "max duration": (r) => r.timings.duration < 4000,
      })
    ) {
      fail(durationMsg);
    }

    // Espera 0.1 segundo entre as requisições
    sleep(0.5);
  }
}
