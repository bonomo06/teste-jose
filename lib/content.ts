// Todo o texto da página. Conteúdo base: monobuild.com.br.

const WHATSAPP_NUMBER = "5519996364658";
const WHATSAPP_MESSAGE = "Olá! Vim pelo site e gostaria de solicitar um orçamento.";

export const contact = {
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  phoneDisplay: "(19) 99636-4658",
  phoneHref: "tel:+5519996364658",
  email: "monobuild@outlook.com.br",
  city: "Indaiatuba - SP",
  instagramUrl: "https://www.instagram.com/monobuildbr/",
  instagramHandle: "@monobuildbr",
};

// Um único rótulo para a intenção "contato/orçamento" em toda a página.
export const CTA_LABEL = "Solicitar orçamento";

export const nav = [
  { label: "Sistemas", href: "#sistema-construtivo" },
  { label: "Serviços", href: "#servicos" },
  { label: "Empresa", href: "#empresa" },
  { label: "Contato", href: "#contato" },
];

export const hero = {
  title: ["Construímos com qualidade.", "Entregamos confiança."],
  subtitle:
    "Construtora em Indaiatuba - SP. Do projeto à entrega, em EPS monolítico, alvenaria estrutural ou light steel frame.",
};

// Etapas sincronizadas com o vídeo. `start`/`end` são o progresso do scroll (0-1)
// em que cada etapa fica ativa. Calibrado a partir do conteúdo dos frames.
export const stages = [
  {
    title: "Planejamento",
    text: "Entendemos o que você precisa e definimos projeto, sistema construtivo e cronograma antes de começar.",
    start: 0.09,
    end: 0.3,
  },
  {
    title: "Execução",
    text: "Executamos a obra com eficiência, qualidade e controle de prazos.",
    start: 0.3,
    end: 0.55,
  },
  {
    title: "Acompanhamento",
    text: "Acompanhamos cada etapa de perto, do fechamento ao acabamento.",
    start: 0.55,
    end: 0.78,
  },
  {
    title: "Entrega",
    text: "Casa pronta, revisada e entregue com a qualidade combinada.",
    start: 0.78,
    end: 1,
  },
];

export type SystemBenefitIcon =
  | "shield"
  | "thermometer"
  | "lightning"
  | "recycle"
  | "leaf"
  | "trend"
  | "timer"
  | "buildings"
  | "feather"
  | "crosshair"
  | "sliders"
  | "stack";

export const systems: {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  benefits: { icon: SystemBenefitIcon; label: string }[];
}[] = [
  {
    id: "eps",
    name: "EPS monolítico",
    tagline: "Mais desempenho em uma única etapa.",
    description:
      "Formas de EPS preenchidas com concreto armado, unindo isolamento térmico e alta resistência estrutural.",
    image: "/images/casaeps.webp",
    imageAlt: "Casa em construção com paredes em painéis de EPS monolítico",
    benefits: [
      { icon: "shield", label: "Alta resistência estrutural" },
      { icon: "thermometer", label: "Isolamento térmico e acústico" },
      { icon: "lightning", label: "Execução rápida e limpa" },
      { icon: "recycle", label: "Redução de desperdícios" },
      { icon: "leaf", label: "Sustentabilidade" },
    ],
  },
  {
    id: "alvenaria",
    name: "Alvenaria estrutural",
    tagline: "Robustez e economia para sua obra.",
    description:
      "As paredes têm função estrutural, dispensando vigas e pilares convencionais, com mais agilidade e menor custo.",
    image: "/images/casaestrutural.webp",
    imageAlt: "Casa em construção com paredes de blocos em alvenaria estrutural",
    benefits: [
      { icon: "trend", label: "Redução no custo da estrutura" },
      { icon: "timer", label: "Maior rapidez na execução" },
      { icon: "buildings", label: "Excelente desempenho estrutural" },
      { icon: "stack", label: "Menos etapas construtivas" },
      { icon: "thermometer", label: "Ótimo desempenho térmico e acústico" },
    ],
  },
  {
    id: "steel",
    name: "Light steel frame",
    tagline: "Leveza, tecnologia e precisão.",
    description:
      "Sistema industrializado em aço galvanizado, ideal para obras mais rápidas, sustentáveis e com alto padrão de acabamento.",
    image: "/images/casasteel.webp",
    imageAlt: "Estrutura de casa em perfis de aço galvanizado, sistema light steel frame",
    benefits: [
      { icon: "feather", label: "Construção a seco" },
      { icon: "shield", label: "Leveza e resistência" },
      { icon: "crosshair", label: "Precisão e qualidade industrial" },
      { icon: "leaf", label: "Sustentabilidade" },
      { icon: "sliders", label: "Flexibilidade de projetos" },
    ],
  },
];

export const services = {
  title: "Da obra nova à reforma.",
  subtitle: "Soluções completas para o seu projeto, residencial ou comercial.",
  items: {
    residencial: {
      title: "Construção residencial",
      text: "Casas sob medida com foco em conforto, segurança e alto padrão de acabamento.",
    },
    comercial: {
      title: "Construção comercial",
      text: "Soluções completas para comércios, escritórios e empreendimentos comerciais.",
    },
    projetos: {
      title: "Projetos personalizados",
      text: "Projetos exclusivos que unem funcionalidade, estética e viabilidade.",
    },
    gerenciamento: {
      title: "Gerenciamento de obras",
      text: "Gestão de todas as etapas da obra para garantir qualidade, prazos e custos.",
    },
    reformas: {
      title: "Reformas e manutenções",
      text: "Renovamos e valorizamos imóveis com soluções eficientes e materiais de qualidade.",
    },
    consultoria: {
      title: "Consultoria técnica",
      text: "Orientação técnica para decisões assertivas e melhores resultados no seu projeto.",
    },
  },
};

export const about = {
  statement: ["Construímos mais que obras.", "Construímos relações."],
  text: "A Monobuild nasceu com o propósito de entregar soluções construtivas inteligentes, seguras e sustentáveis. Unimos engenharia, tecnologia e compromisso para transformar projetos em obras de alta qualidade.",
  values: ["Comprometimento", "Qualidade", "Eficiência"],
};

export const finalCta = {
  title: "Vamos tirar seu projeto do papel?",
  text: "Solicite um orçamento sem compromisso.",
};
