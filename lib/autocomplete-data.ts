// Dados para autocomplete - listas exatas conforme especificado

export interface CrimeOption {
  id: string
  crime: string
  description: string
  category?: string
}

export interface QTHOption {
  id: string
  name: string
  description: string
  category?: string
}

export const CRIMES_LIST: CrimeOption[] = [
  {
    id: "homicidio-doloso-qualificado",
    crime: "Homicidio Doloso Qualificado",
    description: "Quando uma pessoa toma qualquer ação premeditada para causar intencionalmente a morte de outra pessoa."
  },
  {
    id: "homicidio-doloso",
    crime: "Homicidio Doloso", 
    description: "Quando uma pessoa toma qualquer ação não planejada ou deliberada e maliciosamente escolhida não agir, intencionalmente para causar a morte de outra pessoa."
  },
  {
    id: "tentativa-homicidio",
    crime: "Tentativa de Homicidio",
    description: "Quando uma pessoa toma alguma ação."
  },
  {
    id: "homicidio-culposo",
    crime: "Homicidio Culposo",
    description: "Sem querer, causando a morte de uma pessoa sem premeditação. Resultados quando a morte ocorre devido um uso indevido de cuidados ou habilidades razoáveis (imprudência ou negligência)."
  },
  {
    id: "homicidio-culposo-transito",
    crime: "Homicidio Culposo no Transito",
    description: "Quando a pessoa operando o veiculo com um motor se reportar a negligencia para relatar o incidente dentro de um periodo de tempo razoavel."
  },
  {
    id: "roubo",
    crime: "Roubo",
    description: "Subtrair coisa movel alheia, para si ou para outrem, mediante grave ameaça ou violencia a pessoa, ou depois de have-la, por qualquer"
  },
  {
    id: "roubo-banco",
    crime: "Roubo a Banco",
    description: "Roubar um banco."
  },
  {
    id: "roubo-loja",
    crime: "Roubo a loja",
    description: "Roubo a estabelecimento comercial."
  },
  {
    id: "furto-caixa-eletronico",
    crime: "Furto a caixa eletronico",
    description: "Furtar um caixa eletronico / Registradora"
  },
  {
    id: "sequestro",
    crime: "Sequestro",
    description: "Apreender e levar ilegalmente uma pessoa pela força ou fraude, ou apreender e deter uma pessoa contra a sua vontade com a intençao de levar essa pessoa embora mais tarde."
  },
  {
    id: "carcere-privado",
    crime: "Carcere Privado",
    description: "Quando uma pessoa é restringida em seu movimento pessoal dentro de qualquer area sem justificação ou consentimento. A contenção fisica real não é necessaria para um caso de prisao falsa."
  },
  {
    id: "agressao",
    crime: "Agressão",
    description: "Causar danos significativos a outra pessoa através de toque intencional ofensivo ou prejudicial a essa pessoa sem o seu consentimento."
  },
  {
    id: "furto-residencia",
    crime: "Furto De Residencia",
    description: "Subtrair, para si ou para outrem, mas por circunstancias não previstas pelo agente, não se consuma o pretendido."
  },
  {
    id: "terrorismo",
    crime: "Terrorismo",
    description: "o uso ilegal da força e da violencia contra pessoas ou bens para intimidar ou coagir um governo, a população civil ou qualquer segmento dos mesmos, na promoção de objetivos políticos ou sociais."
  },
  {
    id: "trafico-armas",
    crime: "Trafico de Armas*",
    description: "Posse de 3 ou mais armas ilegais."
  },
  {
    id: "porte-ilegal-alto-calibre",
    crime: "Porte ilegal de arma (Alto Calibre)",
    description: "Porte de Thompson, MTAR, AK-47"
  },
  {
    id: "porte-ilegal-baixo-calibre", 
    crime: "Porte ilegal de arma (Baixo Calibre)",
    description: "Porte de Five-seven, 1911, 1911 HK e Calibres semelhantes."
  },
  {
    id: "disparo-arma",
    crime: "Disparo de Arma",
    description: "Disparar arma em publico."
  },
  {
    id: "posse-municao-ilegal",
    crime: "Posse de munição ilegal",
    description: "Posse de munição"
  },
  {
    id: "trafico-coletes",
    crime: "Trafico de coletes balisticos",
    description: "Fabricação de coletes balisticos"
  },
  {
    id: "posse-colete",
    crime: "Posse de colete balistico",
    description: "Posse de colete balistico"
  },
  {
    id: "trafico-entorpecente",
    crime: "Trafico de Entorpecente",
    description: "Posse de 3 ou mais unidades da droga ou materia prima."
  },
  {
    id: "posse-entorpecente",
    crime: "Posse de Entorpecente",
    description: "Posse de 2 ( gramas) ou menos."
  },
  {
    id: "receptacao-veiculos",
    crime: "Receptação de Veiculos",
    description: "Estar posse de qualquer veiculo roubado"
  },
  {
    id: "roubo-veiculos",
    crime: "Roubo de Veiculos",
    description: "Subtrair veiculo alheio, para si ou para outrem, mediante grave ameaça ou violencia a pessoa, ou por qualquer"
  },
  {
    id: "furto-veiculo",
    crime: "Furto de Veiculo",
    description: "Subtrair, para si ou para outrem, coisa alheia movel sem grave ameaça ou violencia a pessoa."
  },
  {
    id: "dinheiro-sujo",
    crime: "Dinheiro Sujo Marcado",
    description: "Pena base mais a cada 1000 de dinheiro sujo se adiciona 1 minuto a pena do individuo."
  },
  {
    id: "dirigir-entorpecente",
    crime: "Dirigir sob efeito entorpecente",
    description: "Conduzir veiculo Automotor ou de tração Humana/Bicicletas sob efeito entorpecente que o faça tornar-se potencialmente perigoso"
  },
  {
    id: "evasao-acidente",
    crime: "Evasão de Acidente",
    description: "Afastar-se do veiculo ou condutor do mesmo, no veiculo local do acidente, para fugir à responsabilidade penal ou civil que lhe"
  },
  {
    id: "posse-arma-publica",
    crime: "Posse de uma arma publica",
    description: "Qualquer pessoa que carregue abertamente uma arma carregada em publico. Incluso impressas, exceto"
  },
  {
    id: "formacao-quadrilha",
    crime: "Formação de Quadrilha",
    description: "Participar abertamente de um crime, contribuindo direta ou indiretamente. Todos responsáveis pelo maior crime cometido no para"
  },
  {
    id: "falsa-identidade",
    crime: "Falsa Identidade",
    description: "Se passar por outra pessoa ou usar documento falso / Falsificação de documento"
  },
  {
    id: "receptacao-produtos",
    crime: "Receptação de Produtos Roubados",
    description: "Estar posse de qualquer produto Roubado"
  },
  {
    id: "multas-pendentes",
    crime: "Multas Pendentes",
    description: "Para cada R$100 de multas pendentes agrava-se penalmente em um mes de reclusão."
  },
  {
    id: "perturbacao-ordem",
    crime: "Perturbação da Ordem",
    description: "Pessoa esta se comportando de maneira disruptiva, mas não apresenta sério perigo publico."
  },
  {
    id: "ameacas-criminosas",
    crime: "Ameaças Criminosas",
    description: "Intencionalmente conscientemente colocando outra pessoa com medo de lesões corporais"
  },
  {
    id: "comunicacao-fraudulenta",
    crime: "Comunicação Fraudulenta",
    description: "Uso de acertos de fato descrito alem da vantagem ilicita para a ou outrem, instaurando por consequencia do mesmo a"
  },
  {
    id: "uso-indevido-canais",
    crime: "Uso Indevido de Canais publicos (190/112)",
    description: "Utilizar, com desordem ou leviandade os canais publicos"
  },
  {
    id: "desobediencia",
    crime: "Desobediencia",
    description: "Nenhuma pessoa poderá dexar de cumprir qualquer ordem legal ou direção de qualquer policial"
  },
  {
    id: "posse-ferramentas-roubo",
    crime: "Posse de ferramentas de roubo / Lockpick",
    description: "Posse de qualquer ferramenta usada para invadir qualquer veiculo ou propriedade"
  },
  {
    id: "oposicao-ato-legal",
    crime: "Oposição a execução de ato legal",
    description: "Impedir, embaracar, retardar ou de qualquer forma obstruir cumprimento de ordem judicial ou ação do autoridade policial."
  },
  {
    id: "abuso-autoridade",
    crime: "Abuso de Autoridade",
    description: "Quando o Agente usa das suas atribuições do cargo para constranger, ameaçar, agredir ou qualquer outro ato que atinja um"
  },
  {
    id: "ocultacao-facial",
    crime: "Ocultação Facial",
    description: "Cobrir totalmente ou parcialmente a face, afim de impossibilitar reconhecimento."
  },
  {
    id: "omissao-socorro",
    crime: "Omissão de socorro",
    description: "Deixar de prestar assistencia, quando possivel faze-lo sem risco pessoal, a pessoa invalida ou ferida"
  },
  {
    id: "uso-equipamento-restrito",
    crime: "Uso de equipamento restrito",
    description: "Utilizar em publico qualquer equipamento da policia ou tipo de colete"
  },
  {
    id: "desacato",
    crime: "Desacato",
    description: "Desacato, desobediencia ou desrespeito perante um tribunal ou Agente da seguranca Publica/Saude na forma de comportamento que opõe ou desafia a autoridade, a justica e a dignidade do tribunal. Um tribunal poder ele considerado posto. Se o infrator continuar a criar um perturbacao"
  },
  {
    id: "conducao-imprudente",
    crime: "Condução imprudente",
    description: "Conducao descuidada, conducao inadequada ou conducao sem o devido cuidado e atencao com o provocar dano em propriedade alheia."
  },
  {
    id: "passagem-ilegal",
    crime: "Passagem Ilegal",
    description: "Forçar ultrapassagem ou ultrapassar em local proibido"
  },
  {
    id: "retorno-ilegal",
    crime: "Retorno Ilegal",
    description: "Retornar em local proibido por placa ou sinalizacao"
  },
  {
    id: "dirigir-sentido-contrario",
    crime: "Dirigir em sentido Contrário",
    description: "Conduzir Veiculo automotor ou de tração humana em sentido contrário ao fluxo de tráfego."
  },
  {
    id: "iluminacao-negligente",
    crime: "Iluminação negligente",
    description: "Conduzir veiculo automotor ou de tração humana com iluminação irregular."
  },
  {
    id: "excesso-velocidade",
    crime: "Excesso de Velocidade",
    description: "Taxa basica de R$50 a cada 10kmh de velocidade registrada em radar acima do limite permitido na via."
  },
  {
    id: "nao-ceder-passagem",
    crime: "Não ceder passagem a viaturas",
    description: "Deixar de ceder à direta para um veiculo de emergência com suas luzes e / ou sirenes ativadas."
  },
  {
    id: "ruido-excessivo",
    crime: "Ruido Excessivo de Veiculo",
    description: "Buzinas, buzinar de musica ou motores de aceleração que causam um incomodo publico."
  },
  {
    id: "corrida-ilegal",
    crime: "Corrida Ilegal",
    description: "Participar ou organizar de corridas ilegais. Condução imprudente sobre vias publicas e zonas rurais."
  },
  {
    id: "uso-excessivo-insulfilm",
    crime: "Uso excessivo de insulim",
    description: "Utilizar insulim, excessivamente escuro afim de impossibilitar identificação do condutor ou passageiros."
  },
  {
    id: "para-brisas-danificados",
    crime: "Para-Brisas/Vidros Danificados",
    description: "Conduzir veiculo automotor com Para-brisas ou vidros danificados."
  },
  {
    id: "lanternas-danificadas",
    crime: "Lanternas danificadas",
    description: "Conduzir veiculo automotor com lanternas traseiras ou dianteiras danificadas."
  },
  {
    id: "veiculo-avariado",
    crime: "Veiculo Gravemente Avariado",
    description: "Conduzir veiculo Automotor gravemente avariado em danos."
  },
  {
    id: "veiculo-estacionado-irregular",
    crime: "Veiculo ilegalmente estacionado",
    description: "Estacionar em um lugar que não seja uma vaga de estacionamento, em uma pista de incêndio, bloqueando uma pista alada ou a"
  },
  {
    id: "impedimento-fluxo-trafego",
    crime: "Impedimento de fluxo de tráfego",
    description: "Dexando um veiculo parado ou estacionado em uma area onde isso afeta o fluxo de tráfego."
  }
];

export const QTH_LIST: QTHOption[] = [
  { id: "maze-bank-arena", name: "Maze Bank Arena", description: "Arena principal da cidade" },
  { id: "porto", name: "Porto", description: "Área portuária" },
  { id: "docas", name: "Docas", description: "Área das docas" },
  { id: "ponte-pqd", name: "Ponte PQD", description: "Ponte principal" },
  { id: "acougue", name: "Açougue", description: "Estabelecimento comercial" },
  { id: "ceramica", name: "Cerâmica", description: "Área industrial" },
  { id: "ferro-velho-maze", name: "Ferro Velho do Maze Bank Arena", description: "Ferro velho próximo ao arena" },
  { id: "ferro-velho-dp-praca", name: "Ferro Velho da DP da praça", description: "Ferro velho próximo à delegacia" },
  { id: "dp-praca", name: "DP da praça", description: "Delegacia de polícia da praça" },
  { id: "tijolinho", name: "Tijolinho", description: "Área residencial" },
  { id: "vagos", name: "Vagos", description: "Território da gangue Vagos" },
  { id: "rua-sem-saida-groove", name: "Rua sem saída da GROOVE", description: "Rua sem saída na área da Grove" },
  { id: "megamall-sul", name: "Megamall do sul", description: "Centro comercial do sul" },
  { id: "bombeiros", name: "Bombeiros", description: "Estação dos bombeiros" },
  { id: "estacionamento-marrom", name: "Estacionamento marrom", description: "Estacionamento público" },
  { id: "suburbios-groove", name: "Subúrbios da GROOVE / Forum Drive", description: "Área residencial da Grove" },
  { id: "igreja-groove", name: "Igreja da Groove", description: "Igreja local" },
  { id: "posto-bennys", name: "Posto da Bennys", description: "Posto de gasolina e oficina" },
  { id: "lava-jato", name: "Lava-Jato", description: "Estabelecimento de lavagem de carros" },
  { id: "eletrica", name: "Elétrica", description: "Loja de materiais elétricos" },
  { id: "hospital-mortos", name: "Hospital dos Mortos", description: "Hospital" },
  { id: "los-santos-shopping", name: "Los Santos do Shopping", description: "Centro comercial principal" },
  { id: "estacionamento-colorido", name: "Estacionamento Colorido", description: "Estacionamento público" },
  { id: "veneza", name: "Veneza", description: "Área costeira" },
  { id: "construcao-weazel", name: "Construção Weazel-News", description: "Construção da empresa de notícias" },
  { id: "construcao-praca", name: "Construção da Praça", description: "Obra na praça" },
  { id: "construcao-arcadius", name: "Construção da Arcadius", description: "Construção do edifício Arcadius" },
  { id: "rockford-plaza", name: "Rockford Plaza / Shopping", description: "Centro comercial Rockford" },
  { id: "vila-chaves", name: "Vila do Chaves", description: "Complexo residencial" },
  { id: "hospital-pillbox", name: "Hospital da Pillbox / Hospital Desativado", description: "Hospital principal" },
  { id: "guetos", name: "Guetos", description: "Área de baixa renda" },
  { id: "estacionamento-laranja-branco", name: "Estacionamento Laranja / Branco", description: "Estacionamento público" },
  { id: "estacionamento-vermelho", name: "Estacionamento Vermelho", description: "Estacionamento público" },
  { id: "heliponto", name: "Heliponto", description: "Pista de pouso para helicópteros" },
  { id: "marinas", name: "Marinas", description: "Porto para embarcações" },
  { id: "orla-praia", name: "Orla da Praia", description: "Área costeira" },
  { id: "calcadao-praia", name: "Calçadão da Praia", description: "Passeio da praia" },
  { id: "cemiterio", name: "Cemitério", description: "Cemitério da cidade" },
  { id: "faculdade", name: "Faculdade", description: "Instituição de ensino" },
  { id: "campo-golfe", name: "Campo de Golfe", description: "Campo de golfe" },
  { id: "tequila-la", name: "Tequila-la", description: "Bar e restaurante" },
  { id: "eclipse-tower", name: "Eclipse Tower", description: "Edifício residencial de luxo" },
  { id: "life-invader", name: "Life Invader", description: "Empresa de tecnologia" },
  { id: "cinema", name: "Cinema", description: "Complexo cinematográfico" },
  { id: "estudio-cinema", name: "Estúdio de Cinema", description: "Estúdio de filmagem" },
  { id: "ovni", name: "Ovni", description: "Local misterioso" },
  { id: "estacionamento-azul", name: "Estacionamento Azul", description: "Estacionamento público" },
  { id: "dp-vinewood", name: "DP de Vinewood", description: "Delegacia de Vinewood" },
  { id: "observatorio", name: "Observatório", description: "Observatório astronômico" },
  { id: "fazenda", name: "Fazenda", description: "Propriedade rural" },
  { id: "museu", name: "Museu", description: "Museu da cidade" },
  { id: "teatro", name: "Teatro", description: "Teatro municipal" },
  { id: "anfiteatro", name: "Anfiteatro", description: "Anfiteatro ao ar livre" },
  { id: "petrolifera", name: "Petrolífera", description: "Refinaria de petróleo" },
  { id: "moto-clube", name: "Moto Clube", description: "Clube de motociclistas" },
  { id: "yellow-jack", name: "Yellow Jack", description: "Bar na área rural" },
  { id: "campinho", name: "Campinho", description: "Área rural" },
  { id: "mirror-park", name: "Mirror Park / Samir", description: "Bairro residencial" },
  { id: "galeria", name: "Galeria", description: "Galeria de arte" },
  { id: "arcadius", name: "Arcadius", description: "Edifício comercial" },
  { id: "aeroporto-trevor", name: "Aeroporto Trevor", description: "Aeroporto no deserto" },
  { id: "aeroporto-sandy", name: "Aeroporto de Sandy Shores", description: "Aeroporto de Sandy Shores" },
  { id: "trailers", name: "Trailers", description: "Parque de trailers" },
  { id: "silos-grape-seed", name: "Silos de Grape Seed", description: "Silos agrícolas" },
  { id: "niobio", name: "Nióbio", description: "Mina de nióbio" },
  { id: "cemiterio-aviao", name: "Cemitério Avião", description: "Cemitério de aviões" },
  { id: "ponte-verde", name: "Ponte Verde", description: "Ponte na área rural" },
  { id: "pier", name: "Pier", description: "Cais da praia" },
  { id: "garagem-antiga", name: "Garagem antiga", description: "Garagem abandonada" },
  { id: "monumento-chines", name: "Monumento Chinês", description: "Monumento histórico" },
  { id: "banco-central", name: "Banco Central", description: "Banco principal da cidade" },
  { id: "parque-eolico", name: "Parque Eólico", description: "Parque de energia eólica" },
  { id: "dp-rodovia", name: "DP da Rodovia", description: "Delegacia da rodovia" },
  { id: "dp-praia", name: "DP da Praia", description: "Delegacia da praia" },
  { id: "pedreira", name: "Pedreira", description: "Área de extração de pedras" },
  { id: "bahamas", name: "Bahamas", description: "Clube noturno" },
  { id: "weazel-news", name: "Weazel News", description: "Empresa de comunicações" },
  { id: "burger-shot", name: "Burger Shot", description: "Rede de fast food" },
  { id: "barragem-mansoes", name: "Barragem das mansões", description: "Barragem na área rica" },
  { id: "madeireira", name: "Madeireira", description: "Empresa madeireira" },
  { id: "pelados", name: "Pelados", description: "Praia de nudismo" },
  { id: "torre-radio", name: "Torre de rádio", description: "Torre de transmissão" },
  { id: "galinheiro", name: "Galinheiro", description: "Criação de aves" },
  { id: "hp-paleto", name: "HP de Paleto", description: "Hospital de Paleto Bay" },
  { id: "bombeiros-paleto", name: "Bombeiros de Paleto", description: "Bombeiros de Paleto Bay" },
  { id: "igreja-paleto", name: "Igreja Paleto", description: "Igreja de Paleto Bay" },
  { id: "dp-paleto", name: "DP de Paleto", description: "Delegacia de Paleto Bay" },
  { id: "estacao-energia", name: "Estação de energia / Mergulhador", description: "Usina elétrica" },
  { id: "hp-antigo", name: "HP Antigo / HP Joalheria", description: "Hospital antigo" },
  { id: "motel-sandy", name: "Motel abandonado de Sandy Shores", description: "Motel em ruínas" },
  { id: "jockey", name: "Jockey", description: "Clube hípico" },
  { id: "barragem", name: "Barragem", description: "Barragem principal" },
  { id: "dinossauro", name: "Dinossauro", description: "Parque temático" },
  { id: "prefeitura", name: "Prefeitura", description: "Sede do governo municipal" },
  { id: "carteiro", name: "Carteiro", description: "Agência dos correios" },
  { id: "vanilla", name: "Vanilla", description: "Clube noturno" },
  { id: "maze-bank", name: "Maze Bank", description: "Sede do banco Maze" },
  { id: "estacionamento-branco", name: "Estacionamento branco", description: "Estacionamento público" },
  { id: "monumento-groove", name: "Monumento da groove", description: "Monumento no bairro Grove" },
  { id: "highway-praia", name: "Highway da Praia", description: "Rodovia costeira" },
  { id: "senora-freeway", name: "Senora Freeway", description: "Rodovia Senora" },
  { id: "los-santos-freeway", name: "Los Santos Freeway", description: "Rodovia Los Santos" },
  { id: "palomino-freeway", name: "Palomino Freeway", description: "Rodovia Palomino" },
  { id: "olimpic-freeway", name: "Olimpic Freeway", description: "Rodovia Olímpica" },
  { id: "la-puerta-freeway", name: "La Puerta Freeway", description: "Rodovia La Puerta" },
  { id: "del-perro-freeway", name: "Del Perro Freeway", description: "Rodovia Del Perro" },
  { id: "estrada-fazenda", name: "Estrada da Fazenda", description: "Estrada rural" },
  { id: "rota-68", name: "Rota 68", description: "Rodovia estadual 68" },
  { id: "estrada-faculdade", name: "Estrada da Faculdade", description: "Estrada para a faculdade" }
];