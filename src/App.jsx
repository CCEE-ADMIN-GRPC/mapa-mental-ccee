
import { useEffect, useLayoutEffect, useMemo, useState, useRef } from 'react';
import { Search, ChevronDown, Layers3, Network, Zap, Eye, SlidersHorizontal, Plus, Minus, LocateFixed, Orbit, Compass, PanelRightClose, ArrowUpRight, BookOpen, Sparkles, Clock3, GitBranch, X, Moon, Sun, GraduationCap, CircleHelp, MousePointer2, Move3d } from 'lucide-react';

const nodes = [
  { id:'root', title:'Decreto 5.163', short:'Regulamentação da comercialização de energia elétrica', kind:'norma', layer:'institucional', env:'NEUTRO', level:0, x:50,y:46,z:0, complexity:2, article:'Decreto nº 5.163, de 30 de julho de 2004', summary:'Regulamenta a comercialização de energia elétrica, o processo de outorga de concessões e de autorizações de geração de energia elétrica.' },
  { id:'instituicoes',title:'Instituições do setor',short:'Papéis e competências',kind:'conceito',layer:'institucional',env:'NEUTRO',level:1,x:50,y:20,z:-55,complexity:2,article:'Capítulo I',summary:'Conheça os agentes institucionais e suas atribuições na organização do setor elétrico.'},
  { id:'comercializacao',title:'Comercialização',short:'Contratação de energia',kind:'conceito',layer:'contratual',env:'AMBOS',level:1,x:25,y:43,z:-55,complexity:4,article:'Capítulo II · Art. 1º',summary:'O decreto organiza a comercialização de energia elétrica entre os ambientes de contratação regulada e livre.'},
  { id:'acl',title:'Ambiente livre · ACL',short:'Negociação bilateral',kind:'conceito',layer:'contratual',env:'ACL',level:2,x:15,y:70,z:-105,complexity:3,article:'Capítulo II · Arts. 47 a 52',summary:'No Ambiente de Contratação Livre, as operações de compra e venda são pactuadas por meio de contratos bilaterais.'},
  { id:'acr',title:'Ambiente regulado · ACR',short:'Leilões e contratos',kind:'conceito',layer:'contratual',env:'ACR',level:2,x:38,y:71,z:-105,complexity:4,article:'Capítulo II · Arts. 11 a 46',summary:'No Ambiente de Contratação Regulada, a compra e venda de energia é realizada por meio de licitações e contratos regulados.'},
  { id:'lastro',title:'Lastro e garantia física',short:'Segurança do suprimento',kind:'conceito',layer:'institucional',env:'AMBOS',level:2,x:72,y:34,z:-105,complexity:5,article:'Capítulo II · Art. 2º',summary:'A contratação deve observar a cobertura do consumo e as regras de lastro previstas no decreto e em regulamentação aplicável.'},
  { id:'leiloes',title:'Leilões de energia',short:'A-1 · A-3 · A-5',kind:'timeline',layer:'leiloes',env:'ACR',level:3,x:35,y:89,z:-155,complexity:3,article:'',summary:'Os leilões organizam a contratação regulada e consideram diferentes prazos de entrega e produtos.'},
  { id:'penalidades',title:'Penalidades',short:'Consequências e sanções',kind:'conceito',layer:'penalidades',env:'AMBOS',level:2,x:84,y:65,z:-105,complexity:3,article:'Capítulo III',summary:'O decreto prevê consequências regulatórias para o descumprimento de obrigações de comercialização.'},
  { id:'quiz',title:'Posso migrar para o ACL?',short:'Decisão interativa',kind:'quiz',layer:'contratual',env:'ACL',level:3,x:7,y:91,z:-155,complexity:2,article:'Consulte a legislação vigente',summary:'A elegibilidade para o mercado livre depende da legislação e regulamentação vigentes. Use esta trilha como orientação de estudo.'},
];
const edges = [['root','instituicoes'],['root','comercializacao'],['root','lastro'],['root','penalidades'],['comercializacao','acl'],['comercializacao','acr'],['acr','leiloes'],['acl','quiz'],['lastro','penalidades']];
const allCategoryNodes = [
  {id:'root',title:'Decreto n\u00ba 5.163/2004',short:'Comercializa\u00e7\u00e3o de energia',detailText:'Marco regulat\u00f3rio da comercializa\u00e7\u00e3o de energia el\u00e9trica.',kind:'norma',layer:'institucional',env:'NEUTRO',level:0,x:50,y:50,z:0,article:'Decreto n\u00ba 5.163, de 30 de julho de 2004'},
  {id:'finalidade',title:'Finalidade',short:'Regras e concess\u00f5es',detailText:'\u2022 Regulamenta a comercializa\u00e7\u00e3o\n\u2022 Disciplina concess\u00f5es e autoriza\u00e7\u00f5es de gera\u00e7\u00e3o\n\u2022 Aplica-se ao Sistema Interligado Nacional (SIN)',kind:'conceito',layer:'institucional',env:'NEUTRO',level:1,x:29,y:10,z:-55,article:'Decreto n\u00ba 5.163/2004'},
  {id:'finalidade-detalhe',title:'Finalidade do decreto',short:'Organiza o setor no SIN',detailText:'O decreto organiza as regras de comercializa\u00e7\u00e3o de energia el\u00e9trica e disciplina concess\u00f5es e autoriza\u00e7\u00f5es de gera\u00e7\u00e3o no SIN.',kind:'conceito',layer:'institucional',env:'NEUTRO',level:2,x:8,y:10,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'geracao',title:'Gera\u00e7\u00e3o de energia',short:'Lastro e modalidades',detailText:'\u2022 Vendedores comprovam lastro\n\u2022 Existente: outorgada ou em opera\u00e7\u00e3o\n\u2022 Nova: sem outorga at\u00e9 o edital\n\u2022 Gera\u00e7\u00e3o distribu\u00edda:\n  \u2022 Ligada \u00e0 rede do comprador\n  \u2022 Chamada p\u00fablica: at\u00e9 10% da carga\n  \u2022 Aproxima produ\u00e7\u00e3o e consumo',kind:'conceito',layer:'institucional',env:'AMBOS',level:1,x:29,y:31,z:-55,article:'Decreto n\u00ba 5.163/2004'},
  {id:'lastro-detalhe',title:'Lastro de energia',short:'Energia para cumprir contratos',detailText:'Os vendedores precisam comprovar lastro, garantindo que tenham energia suficiente para cumprir seus contratos.',kind:'conceito',layer:'institucional',env:'AMBOS',level:2,x:8,y:27,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'geracao-distribuida',title:'Gera\u00e7\u00e3o distribu\u00edda',short:'Energia perto do consumo',detailText:'A energia \u00e9 produzida pr\u00f3xima ao consumidor e conectada \u00e0 rede da distribuidora, podendo ser contratada por chamada p\u00fablica.',kind:'conceito',layer:'institucional',env:'AMBOS',level:2,x:8,y:43,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'comercializacao',title:'Comercializa\u00e7\u00e3o',short:'Contratos e regras',detailText:'\u2022 Contratos informados, registrados, homologados ou aprovados\n\u2022 Regras: ANEEL e CCEE',kind:'conceito',layer:'contratual',env:'AMBOS',level:1,x:29,y:58,z:-55,article:'Decreto n\u00ba 5.163/2004'},
  {id:'comercializacao-detalhe',title:'Compra e venda',short:'Contratos registrados',detailText:'A compra e venda de energia segue contratos registrados e regras definidas pelos \u00f3rg\u00e3os reguladores e pela CCEE.',kind:'conceito',layer:'contratual',env:'AMBOS',level:2,x:8,y:58,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'principios',title:'Princ\u00edpios',short:'Diretrizes do modelo',detailText:'\u2022 Seguran\u00e7a do suprimento\n\u2022 Transpar\u00eancia e publicidade\n\u2022 Competi\u00e7\u00e3o\n\u2022 Modicidade tarif\u00e1ria',kind:'conceito',layer:'penalidades',env:'AMBOS',level:1,x:29,y:83,z:-55,article:'Decreto n\u00ba 5.163/2004'},
  {id:'principios-detalhe',title:'Princ\u00edpios do setor',short:'Seguran\u00e7a e competi\u00e7\u00e3o',detailText:'O modelo busca seguran\u00e7a do suprimento, transpar\u00eancia, publicidade, competi\u00e7\u00e3o e modicidade tarif\u00e1ria.',kind:'conceito',layer:'penalidades',env:'AMBOS',level:2,x:8,y:83,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'ambientes',title:'Ambientes de contrata\u00e7\u00e3o',short:'ACR regulado e ACL livre',detailText:'\u2022 ACR \u2014 regulado: venda a distribuidoras por leil\u00f5es, com energia existente e nova\n\u2022 Garante atendimento ao mercado\n\u2022 ACL \u2014 livre: negocia\u00e7\u00e3o e contratos bilaterais\n\u2022 Geradores, comercializadores, importadores, exportadores e consumidores\n\u2022 Pre\u00e7os, prazos e volumes definidos pelas partes',kind:'conceito',layer:'contratual',env:'AMBOS',level:1,x:71,y:15,z:-55,article:'Decreto n\u00ba 5.163/2004'},
  {id:'ambientes-detalhe',title:'Mercado de energia',short:'Dois ambientes',detailText:'O mercado \u00e9 dividido em dois ambientes: regulado, com contrata\u00e7\u00e3o por leil\u00f5es, e livre, com negocia\u00e7\u00e3o direta entre os participantes.',kind:'conceito',layer:'contratual',env:'AMBOS',level:2,x:92,y:12,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'acr',title:'ACR',short:'Contrata\u00e7\u00e3o por leil\u00f5es',detailText:'No Ambiente de Contrata\u00e7\u00e3o Regulada, distribuidoras compram energia principalmente por leil\u00f5es para garantir o atendimento dos consumidores.',kind:'conceito',layer:'contratual',env:'ACR',level:2,x:92,y:30,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'acl',title:'ACL',short:'Negocia\u00e7\u00e3o direta',detailText:'No Ambiente de Contrata\u00e7\u00e3o Livre, os participantes negociam diretamente pre\u00e7os, prazos, volumes e condi\u00e7\u00f5es dos contratos.',kind:'conceito',layer:'contratual',env:'ACL',level:2,x:92,y:48,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'distribuicao',title:'Distribui\u00e7\u00e3o',short:'Atendimento ao mercado',detailText:'\u2022 Distribuidoras atendem 100% do mercado contratado\n\u2022 Contratos registrados na CCEE\n\u2022 Compra priorit\u00e1ria por leil\u00f5es no ACR\n\u2022 Custos de compra influenciam tarifas',kind:'conceito',layer:'leiloes',env:'ACR',level:1,x:71,y:45,z:-55,article:'Decreto n\u00ba 5.163/2004'},
  {id:'distribuicao-detalhe',title:'Distribuidoras',short:'Contrata\u00e7\u00e3o e tarifas',detailText:'As distribuidoras devem contratar energia suficiente para atender seu mercado, registrar contratos e considerar os custos nas tarifas.',kind:'conceito',layer:'leiloes',env:'ACR',level:2,x:92,y:64,z:-105,article:'Decreto n\u00ba 5.163/2004'},
  {id:'agentes',title:'\u00d3rg\u00e3os e agentes envolvidos',short:'ANEEL, CCEE e MME',detailText:'\u2022 ANEEL \u2014 regula, fiscaliza e disciplina\n\u2022 CCEE \u2014 registra contratos e viabiliza a comercializa\u00e7\u00e3o\n\u2022 MME \u2014 coordena diretrizes do setor\n\u2022 Agentes \u2014 geradores, distribuidoras, comercializadores e consumidores livres',kind:'conceito',layer:'institucional',env:'AMBOS',level:1,x:71,y:75,z:-55,article:'Decreto n\u00ba 5.163/2004'},
  {id:'agentes-detalhe',title:'Pap\u00e9is institucionais',short:'Regula\u00e7\u00e3o e opera\u00e7\u00e3o',detailText:'ANEEL regula e fiscaliza; CCEE registra e viabiliza a comercializa\u00e7\u00e3o; MME coordena diretrizes; agentes geram, distribuem, comercializam e consomem energia.',kind:'conceito',layer:'institucional',env:'AMBOS',level:2,x:92,y:84,z:-105,article:'Decreto n\u00ba 5.163/2004'},
];
const operationalNode=(id,title,short,detailText,x,y,kind='topic',layer='institucional')=>({
  id:`op-${id}`,title,short,detailText,
  kind:kind==='root'?'norma':'conceito',operationalKind:kind,layer,env:'AMBOS',level:kind==='branch'?1:kind==='topic'?2:kind==='root'?0:3,
  x,y,z:kind==='branch'?-55:kind==='topic'?-105:kind==='root'?0:-155,article:'Decreto nº 5.163/2004'
});
const operationalNodes=[
  operationalNode('root','Decreto nº 5.163/2004','Marco regulatório da comercialização de energia elétrica','Marco regulatório da comercialização de energia elétrica.',50,50,'root'),
  operationalNode('fundamentos','Fundamentos Regulatórios','Regras e instituições do setor','Finalidade, princípios, instituições e ambientes de contratação.',38,24,'branch'),
  operationalNode('finalidade','Finalidade','Regras e concessões','• Regulamenta a comercialização\n• Disciplina concessões e autorizações de geração\n• Aplica-se ao Sistema Interligado Nacional (SIN)',24,9),
  operationalNode('finalidade-nota','Objetivo no SIN','', 'O decreto organiza as regras de comercialização de energia elétrica e disciplina concessões e autorizações de geração no SIN.',9,9,'note'),
  operationalNode('principios','Princípios','Diretrizes regulatórias','• Segurança do suprimento e confiabilidade do fornecimento.\n• Equilíbrio entre segurança energética e modicidade tarifária.\n• Publicidade, transparência e igualdade de acesso nas chamadas públicas de geração distribuída.\n• Fiscalização e cumprimento das obrigações contratuais.\n• Incentivo à competição por meio dos processos licitatórios, como característica do modelo de contratação.',24,21),
  operationalNode('agentes','Órgãos e agentes','Instituições e participantes','ANEEL — regula, fiscaliza e disciplina.\nCCEE — registra contratos e viabiliza a comercialização.\nMME — coordena diretrizes do setor.\nEPE — realiza estudos técnicos e habilita empreendimentos para leilões.\nCNPE — propõe critérios gerais de garantia de suprimento.\nONS — fornece estimativas de custos operativos previstas no decreto.\nAgentes — geradores, distribuidores, comercializadores e consumidores livres.',24,33),
  operationalNode('agentes-nota','Papel das instituições','', 'ANEEL regula, fiscaliza e disciplina; CCEE registra contratos e viabiliza a comercialização; MME coordena diretrizes do setor; EPE realiza estudos técnicos e habilita empreendimentos para leilões; CNPE propõe critérios gerais de garantia de suprimento; ONS fornece estimativas de custos operativos; agentes geram, distribuem, comercializam e consomem energia.',9,33,'note'),
  operationalNode('ambientes','Ambientes de contratação','Regras ACR vs. ACL','ACR — regulado: venda a distribuidoras por leilões; energia existente e nova; garante atendimento ao mercado.\n\nACL — livre: negociação e contratos bilaterais; geradores, comercializadores, importadores, exportadores e consumidores; preços, prazos e volumes definidos pelas partes.',24,46),
  operationalNode('ambientes-nota','Divisão do mercado','', 'O mercado é dividido em dois ambientes: regulado, com contratação por leilões, e livre, com negociação direta entre os participantes.',9,42,'note'),
  operationalNode('acr-nota','ACR (Regulado)','', 'No Ambiente de Contratação Regulada, distribuidoras compram energia principalmente por leilões para garantir o atendimento dos consumidores de baixa tensão.',9,50,'note'),
  operationalNode('acl-nota','ACL (Livre)','', '• Compra e venda por contratos bilaterais livremente negociados.\n• Participação de geradores, comercializadores, importadores, exportadores e consumidores livres.\n• Condições comerciais, prazos e volumes definidos entre as partes, conforme a regulação.',9,59,'note'),

  operationalNode('geracao-contratacao','Geração e contratação','Geração, leilões e contratos','Geração, geração distribuída, leilões e contratos CCEAR.',38,76,'branch','leiloes'),
  operationalNode('geracao','Geração de energia','Lastro e modalidades','• Vendedores comprovam lastro para 100% dos contratos comercializados.\n• O lastro é constituído pela garantia física de geração própria ou contratada de terceiros.\n• O MME define a garantia física, calculada pela EPE.\n• Atrasos e indisponibilidade podem exigir contratação adicional para cobertura das obrigações.',24,62,'topic','leiloes'),
  operationalNode('lastro-nota','Comprovação de lastro','', 'Os vendedores precisam comprovar lastro, garantindo que tenham energia suficiente para cumprir seus contratos.',9,63,'note','leiloes'),
  operationalNode('garantia-nota','Conceito de garantia física','', 'A garantia física é a quantidade de energia atribuída regulatoriamente a uma usina que pode ser utilizada como respaldo para contratos de comercialização, considerando sua contribuição ao suprimento do sistema elétrico. Ela é calculada pela EPE conforme metodologia do MME, que define o valor oficial.',9,71,'note','leiloes'),
  operationalNode('geracao-distribuida','Geração Distribuída','Energia próxima do consumidor','• Contratação precedida de chamada pública, com transparência e igualdade de acesso.\n• Limite geral de contratação de até 10% da carga da distribuidora, ressalvadas as exceções legais.\n• Exigência de lastro e tratamento contratual de atrasos ou indisponibilidade.\n• Critérios específicos de enquadramento para empreendimentos hidrelétricos e termelétricos.',24,77,'topic','leiloes'),
  operationalNode('gd-nota','Conceito e chamada pública','', 'A energia é produzida próxima ao consumidor e conectada à rede da distribuidora, podendo ser contratada por chamada pública.',9,80,'note','leiloes'),
  operationalNode('leiloes','Leilões','Modalidades e prazos','• Leilões promovidos pela ANEEL, direta ou indiretamente.\n• Contratação de energia nova, existente e de fontes alternativas.\n• Planejamento por anos de antecedência em relação ao início do suprimento.\n• Leilões de ajuste complementam as necessidades das distribuidoras.\n• Editais definem condições, garantias e modalidades contratuais.',24,88,'topic','leiloes'),
  operationalNode('leiloes-nota','Modalidades de leilões','', '• Energia nova: contratação de novos empreendimentos.\n• Energia existente: contratação de empreendimentos existentes.\n• Fontes alternativas: contratação exclusiva de fontes alternativas.\n• Projetos indicados pelo CNPE e aprovados pelo presidente da República.\n• Geração com transmissão associada: novos empreendimentos e ativos de transmissão necessários ao escoamento.\n• Leilões de ajuste: complementação contratual, com suprimento de até dois anos e limite de 5% da carga contratada.',9,90,'note','leiloes'),
  operationalNode('ccear','Contratos CCEAR','Comercialização no ACR','• Contratos bilaterais formalizados entre vendedores vencedores dos leilões e distribuidoras compradoras.\n• Modalidades por quantidade ou disponibilidade de energia.\n• Na modalidade por quantidade, os vendedores assumem os riscos hidrológicos.\n• Na modalidade por disponibilidade, os riscos hidrológicos são assumidos pelos compradores.\n• Prazos de duração definidos conforme o tipo de empreendimento contratado.',24,97,'topic','leiloes'),

  operationalNode('mercado-distribuicao','Mercado e Distribuição','Comercialização e atendimento','Comercialização, distribuição, consumidor livre e gestão de sobras e déficits.',62,24,'branch','contratual'),
  operationalNode('comercializacao','Comercialização','Contratos e regras','• Operações de compra e venda realizadas nos ambientes ACR e ACL.\n• Contratos sujeitos a registro na CCEE e, quando aplicável, a registro, aprovação ou homologação pela ANEEL.\n• Comercialização regida por convenção, regras e procedimentos específicos.\n• CCEE realiza contabilização e liquidação das operações no mercado de curto prazo.\n• Diferenças de energia são liquidadas com base no PLD.',76,10,'topic','contratual'),
  operationalNode('registro-nota','Registro de contratos','', 'A compra e venda de energia segue contratos registrados e regras definidas pelos órgãos reguladores e pela CCEE.',92,6,'note','contratual'),
  operationalNode('diretrizes-nota','Diretrizes do modelo','', 'O modelo busca segurança do suprimento, transparência, publicidade, competição e modicidade tarifária.',92,16,'note','contratual'),
  operationalNode('distribuicao','Distribuição','Atendimento ao mercado','• Distribuidoras atendem 100% do mercado contratado.\n• Contratação principalmente por leilões no ACR, observadas as exceções do decreto.\n• Contratos registrados na CCEE.\n• Gestão de sobras e déficits contratuais.\n• Custos de aquisição sujeitos às regras de repasse tarifário da ANEEL.',76,29,'topic','contratual'),
  operationalNode('distribuidoras-nota','Obrigações das distribuidoras','', 'As distribuidoras devem contratar energia suficiente para atender seu mercado, registrar os contratos e considerar os custos nas tarifas.',92,26,'note','contratual'),
  operationalNode('excecoes-nota','Exceções de contratação','', '• Geração distribuída, PROINFA, Itaipu, cotas de garantia física e Angra I/II.\n• Distribuidoras com mercado inferior a 500 GWh/ano possuem modalidades alternativas de aquisição.',92,36,'note','contratual'),
  operationalNode('consumidor-livre','Consumidor Livre','Contratação no ACL','• Consumidores livres adquirem energia fora das condições reguladas de fornecimento.\n• Contratação no ACL por meio de operações livremente negociadas.\n• Obrigações de participação ou representação na CCEE.\n• Retorno ao atendimento regulado sujeito aos prazos e condições previstos no decreto.\n• Consumidores livres permanecem sujeitos aos tributos e encargos aplicáveis, salvo exceções legais ou regulamentares.',76,49,'topic','contratual'),
  operationalNode('migracao-nota','Regras de migração e retorno','', '• Migração de consumidor potencialmente livre com contrato indeterminado: fornecimento a partir do ano seguinte à declaração formal.\n• Comunicação da opção até 15 dias antes da declaração da necessidade de compra pela distribuidora.\n• Retorno ao ACR: comunicação com antecedência mínima de cinco anos, com possibilidade de redução dos prazos pela distribuidora.\n• Descumprimento das declarações pode gerar obrigação de ressarcimento.',92,49,'note','contratual'),
  operationalNode('sobras-deficits','Sobras e déficits contratuais','Gestão de contratos','• Ajuste da contratação às variações do mercado de distribuição.\n• Leilões de energia existente permitem reposição contratual e recuperação de mercado.\n• Leilões de ajuste complementam a energia necessária ao atendimento das cargas.\n• Possibilidade de redução dos CCEAR de energia existente nas hipóteses previstas.\n• Aplicação de mecanismos de compensação de sobras e déficits.',76,61,'topic','contratual'),

  operationalNode('regulacao-resultados','Regulação e Resultados','Liquidação, tarifas e outorgas','Mercado de curto prazo, repasse tarifário, lastro, penalidades e outorgas.',62,76,'branch','penalidades'),
  operationalNode('curto-prazo','Mercado de curto prazo','Liquidação pelo PLD','• CCEE realiza a contabilização e a liquidação das operações.\n• Liquidação financeira das diferenças com base no Preço de Liquidação das Diferenças — PLD.\n• PLD calculado com base no custo marginal de operação, observados limites regulatórios.\n• Consideração das condições operativas e restrições de transmissão entre submercados.\n• Encargos destinados à cobertura de serviços do sistema.',76,63,'topic','penalidades'),
  operationalNode('pld-nota','Limites do PLD','', '• PLD mínimo: impede que o preço de liquidação fique abaixo do piso regulatório. Segundo o art. 57, § 3º, considera custos de operação e manutenção de hidrelétricas, compensação pelo uso dos recursos hídricos e royalties.\n• PLD máximo: limita o preço durante situações de custos elevados ou escassez energética. O art. 57, § 2º, considera os custos variáveis de operação das termelétricas disponíveis para despacho centralizado.',92,63,'note','penalidades'),
  operationalNode('repasse-tarifario','Repasse Tarifário','Custos de aquisição','• ANEEL disciplina o reconhecimento dos custos de aquisição de energia pelas distribuidoras.\n• Valor Anual de Referência — VR utilizado nos critérios de repasse.\n• Regras específicas de repasse conforme a modalidade de contratação.\n• Limitações aplicáveis aos custos de aquisições no mercado de curto prazo.\n• Encargos setoriais e custos variáveis considerados nos reajustes e revisões tarifárias.',76,76,'topic','penalidades'),
  operationalNode('lastro-penalidades','Lastro e penalidades','Obrigações dos agentes','• Obrigação de lastro para 100% dos contratos dos vendedores.\n• Distribuidoras devem assegurar contratação integral de seus mercados.\n• Consumidores não atendidos integralmente em condições reguladas devem cobrir suas cargas conforme o decreto.\n• CCEE realiza aferição mensal das obrigações.\n• Descumprimentos sujeitos a penalidades.\n• Exposição contratual involuntária reconhecida pela ANEEL pode afastar penalidades específicas.',76,87,'topic','penalidades'),
  operationalNode('outorgas','Outorgas','Concessões e autorizações','• Outorgas de geração concedidas conforme o regime jurídico do empreendimento.\n• Vencedores de licitações podem receber concessões ou autorizações.\n• Concessões incluem serviço público e uso de bem público.\n• Autorização de termelétricas condicionada à comprovação de disponibilidade de combustível.\n• Competências do MME e atribuições delegadas à ANEEL.',76,97,'topic','penalidades')
];const operationalEdges=[
  ['op-root','op-fundamentos'],['op-root','op-geracao-contratacao'],['op-root','op-mercado-distribuicao'],['op-root','op-regulacao-resultados'],
  ['op-fundamentos','op-finalidade'],['op-fundamentos','op-principios'],['op-fundamentos','op-agentes'],['op-fundamentos','op-ambientes'],
  ['op-finalidade','op-finalidade-nota'],['op-agentes','op-agentes-nota'],['op-ambientes','op-ambientes-nota'],['op-ambientes','op-acr-nota'],['op-ambientes','op-acl-nota'],
  ['op-geracao-contratacao','op-geracao'],['op-geracao-contratacao','op-geracao-distribuida'],['op-geracao-contratacao','op-leiloes'],['op-geracao-contratacao','op-ccear'],
  ['op-geracao','op-lastro-nota'],['op-geracao','op-garantia-nota'],['op-geracao-distribuida','op-gd-nota'],['op-leiloes','op-leiloes-nota'],
  ['op-mercado-distribuicao','op-comercializacao'],['op-mercado-distribuicao','op-distribuicao'],['op-mercado-distribuicao','op-consumidor-livre'],['op-mercado-distribuicao','op-sobras-deficits'],
  ['op-comercializacao','op-registro-nota'],['op-comercializacao','op-diretrizes-nota'],['op-distribuicao','op-distribuidoras-nota'],['op-distribuicao','op-excecoes-nota'],['op-consumidor-livre','op-migracao-nota'],
  ['op-regulacao-resultados','op-curto-prazo'],['op-regulacao-resultados','op-repasse-tarifario'],['op-regulacao-resultados','op-lastro-penalidades'],['op-regulacao-resultados','op-outorgas'],['op-curto-prazo','op-pld-nota']
];
const allCategoryEdges = [
  ['root','finalidade'],['finalidade','finalidade-detalhe'],
  ['root','geracao'],['geracao','lastro-detalhe'],['geracao','geracao-distribuida'],
  ['root','comercializacao'],['comercializacao','comercializacao-detalhe'],
  ['comercializacao','principios'],['principios','principios-detalhe'],
  ['root','ambientes'],['ambientes','ambientes-detalhe'],['ambientes','acr'],['ambientes','acl'],
  ['root','distribuicao'],['distribuicao','distribuicao-detalhe'],
  ['root','agentes'],['agentes','agentes-detalhe'],
];
const generatorNodes=[
  {id:'gen-root',title:'Decreto nº 5.163/2004',short:'Regras para quem gera e vende energia',detailText:'Para o gerador, o decreto conecta a outorga do empreendimento à comercialização da energia, à cobertura dos contratos e à apuração das obrigações no mercado.',kind:'norma',layer:'institucional',env:'AMBOS',level:0,x:50,y:50,z:0,article:'Decreto nº 5.163/2004'},
  {id:'gen-outorga',title:'Empreendimento e outorga',short:'Como o gerador se habilita',detailText:'Concessões e autorizações definem o regime de implantação e exploração do empreendimento. A forma de outorga depende do projeto, do edital e da legislação aplicável.',kind:'conceito',layer:'institucional',env:'AMBOS',level:1,x:39,y:25,z:-55,article:'Arts. 11 a 13 e 60 a 63'},
  {id:'gen-regimes',title:'Regime de geração',short:'Concessão ou autorização',detailText:'O decreto reconhece concessionários, permissionários e autorizados de geração como agentes vendedores. Autoprodutores podem comercializar excedentes de forma eventual e temporária, mediante autorização da ANEEL.',kind:'conceito',layer:'institucional',env:'AMBOS',level:2,x:8,y:9,z:-105,article:'Arts. 1º e 9º'},
  {id:'gen-projetos',title:'Projeto novo e ampliação',short:'Enquadramento no leilão',detailText:'Para o ACR, é novo o empreendimento sem concessão, permissão ou autorização na data do edital; também pode ser novo o acréscimo de capacidade instalada de empreendimento existente. A EPE cadastra e habilita tecnicamente projetos para leilões de novos empreendimentos.',kind:'conceito',layer:'institucional',env:'AMBOS',level:2,x:8,y:25,z:-105,article:'Arts. 11 e 12'},
  {id:'gen-termica',title:'Projeto termelétrico',short:'Disponibilidade de combustível',detailText:'A implantação de novo empreendimento termelétrico depende da comprovação de disponibilidade dos combustíveis necessários. A autorização pode exigir capacidade de operar com combustível substituto.',kind:'conceito',layer:'institucional',env:'AMBOS',level:2,x:8,y:41,z:-105,article:'Art. 61'},
  {id:'gen-venda',title:'Onde vender',short:'ACR ou ACL',detailText:'O gerador pode comercializar energia no Ambiente de Contratação Regulada ou no Ambiente de Contratação Livre, observando as regras próprias de cada ambiente.',kind:'conceito',layer:'contratual',env:'AMBOS',level:1,x:61,y:25,z:-55,article:'Arts. 1º e 9º'},
  {id:'gen-acr',title:'Venda no ACR',short:'Leilões de energia',detailText:'No ACR, a energia é contratada por leilões promovidos pela ANEEL, direta ou indiretamente. Geradores habilitados podem ofertar energia de empreendimentos novos ou existentes conforme o edital.',kind:'conceito',layer:'contratual',env:'ACR',level:2,x:92,y:9,z:-105,article:'Arts. 11, 12 e 19'},
  {id:'gen-ccear',title:'Contrato CCEAR',short:'Gerador e distribuidoras',detailText:'Vencedores de leilões de energia de empreendimentos novos ou existentes formalizam CCEAR bilateral com os agentes de distribuição compradores. O contrato e o edital definem o produto, os montantes e o suprimento.',kind:'conceito',layer:'contratual',env:'ACR',level:2,x:92,y:23,z:-105,article:'Arts. 27 e 28'},
  {id:'gen-modalidades',title:'Quantidade ou disponibilidade',short:'Alocação dos riscos',detailText:'No CCEAR por quantidade, o vendedor assume os riscos hidrológicos. No CCEAR por disponibilidade, esses riscos cabem aos compradores; a exposição financeira no curto prazo segue o tratamento previsto no contrato e nas regras aplicáveis.',kind:'conceito',layer:'contratual',env:'ACR',level:2,x:92,y:37,z:-105,article:'Art. 28'},
  {id:'gen-acl',title:'Venda no ACL',short:'Contratos bilaterais',detailText:'No ACL, geradores e compradores negociam contratos bilaterais conforme as regras de comercialização. As condições comerciais são pactuadas entre as partes, e os contratos devem ser informados e registrados conforme o caso.',kind:'conceito',layer:'contratual',env:'ACL',level:2,x:92,y:51,z:-105,article:'Arts. 1º, 9º e 10'},
  {id:'gen-lastro',title:'Lastro para vender',short:'Cobertura de 100% dos contratos',detailText:'O agente vendedor deve apresentar lastro para garantir cem por cento dos contratos de venda. O lastro pode vir da garantia física de geração própria ou de energia comprada de terceiros por contrato.',kind:'conceito',layer:'penalidades',env:'AMBOS',level:1,x:39,y:75,z:-55,article:'Art. 2º, I e § 1º'},
  {id:'gen-garantia',title:'Garantia física',short:'Limite para comercialização',detailText:'A garantia física representa a quantidade máxima de energia do empreendimento que pode ser usada para comprovar atendimento de carga ou comercialização por contratos. É definida pelo MME, calculada pela EPE segundo metodologias do MME e revisada periodicamente.',kind:'conceito',layer:'penalidades',env:'AMBOS',level:2,x:23,y:54,z:-105,article:'Arts. 2º, §§ 2º e 3º, e 4º'},
  {id:'gen-cobertura',title:'Balanço de contratos',short:'Geração própria ou compra',detailText:'A cobertura das vendas pode combinar geração própria e contratos de compra de energia. O gerador precisa acompanhar os montantes contratados e a disponibilidade do seu portfólio para manter lastro suficiente.',kind:'conceito',layer:'penalidades',env:'AMBOS',level:2,x:23,y:66,z:-105,article:'Arts. 2º e 5º'},
  {id:'gen-afericao',title:'Aferição e penalidades',short:'Verificação mensal pela CCEE',detailText:'A CCEE afere mensalmente as obrigações de lastro. O descumprimento pode sujeitar o agente às penalidades previstas na Convenção, nas Regras e nos Procedimentos de Comercialização.',kind:'conceito',layer:'penalidades',env:'AMBOS',level:2,x:23,y:78,z:-105,article:'Art. 3º'},
  {id:'gen-indisponibilidade',title:'Atraso ou indisponibilidade',short:'Proteção dos contratos de venda',detailText:'Se unidades não iniciarem operação no prazo ou ficarem indisponíveis e o vendedor não tiver lastro suficiente, poderá ser necessário comprar energia para cumprir as vendas originais, conforme os casos e prazos definidos pela ANEEL.',kind:'conceito',layer:'penalidades',env:'AMBOS',level:2,x:23,y:90,z:-105,article:'Arts. 5º e 6º'},
  {id:'gen-operacao',title:'Operação e liquidação',short:'Interface com CCEE e ONS',detailText:'A comercialização contratual se conecta à operação física do SIN e à contabilização do mercado. O decreto prevê contabilização e liquidação pela CCEE segundo as Regras e os Procedimentos de Comercialização.',kind:'conceito',layer:'leiloes',env:'AMBOS',level:1,x:61,y:75,z:-55,article:'Arts. 58 e 59'},
  {id:'gen-registro',title:'Registro dos contratos',short:'Informação e validação',detailText:'Contratos de comercialização devem ser informados, registrados, homologados ou aprovados pela ANEEL, conforme o caso. No ACL, os procedimentos da CCEE definem registro, validação e prazos operacionais.',kind:'conceito',layer:'leiloes',env:'AMBOS',level:2,x:77,y:54,z:-105,article:'Art. 10 e Procedimentos CCEE'},
  {id:'gen-curto-prazo',title:'Mercado de curto prazo',short:'Diferenças liquidadas ao PLD',detailText:'A contabilização identifica as quantidades comercializadas e liquidadas ao Preço de Liquidação das Diferenças (PLD). Exposições dependem da medição, dos contratos, das regras vigentes e do perfil de geração.',kind:'conceito',layer:'leiloes',env:'AMBOS',level:2,x:77,y:66,z:-105,article:'Arts. 56 a 58'},
  {id:'gen-riscos',title:'Reposição e risco de preço',short:'Responsabilidade do vendedor',detailText:'Quando precisa comprar energia para cobrir vendas originais por atraso ou indisponibilidade, o vendedor responde pelos contratos de compra e pelos riscos de diferença de preço entre submercados, conforme o decreto.',kind:'conceito',layer:'leiloes',env:'AMBOS',level:2,x:77,y:78,z:-105,article:'Arts. 5º a 7º'},
  {id:'gen-servicos',title:'Serviços ao sistema',short:'Encargos e serviços ancilares',detailText:'As regras de comercialização podem prever encargos para cobrir custos de serviços do sistema, inclusive serviços ancilares. O decreto também trata de serviços prestados por geradores, como reserva operativa e suporte à operação, conforme regras aplicáveis.',kind:'conceito',layer:'leiloes',env:'AMBOS',level:2,x:77,y:90,z:-105,article:'Art. 59'},
];
const generatorEdges=[
  ['gen-root','gen-outorga'],['gen-root','gen-venda'],['gen-root','gen-lastro'],['gen-root','gen-operacao'],
  ['gen-outorga','gen-regimes'],['gen-outorga','gen-projetos'],['gen-outorga','gen-termica'],
  ['gen-venda','gen-acr'],['gen-venda','gen-ccear'],['gen-venda','gen-modalidades'],['gen-venda','gen-acl'],
  ['gen-lastro','gen-garantia'],['gen-lastro','gen-cobertura'],['gen-lastro','gen-afericao'],['gen-lastro','gen-indisponibilidade'],
  ['gen-operacao','gen-registro'],['gen-operacao','gen-curto-prazo'],['gen-operacao','gen-riscos'],['gen-operacao','gen-servicos'],
];
const layerLabels = {institucional:'Institucional',contratual:'Contratual',penalidades:'Penalidades',leiloes:'Leilões'};
const personas = [{id:'todos',label:'Geral',icon:Eye},{id:'operacional',label:'Operacional',icon:GitBranch},{id:'gerador',label:'Gerador',icon:Zap}];
const nodeInsights = {
  root:'O decreto estrutura a comercialização de energia e trata de concessões e autorizações de geração. Consulte sempre a versão consolidada e as normas posteriores relacionadas.',
  instituicoes:'A regulação distribui responsabilidades entre órgãos e agentes do setor. ANEEL regula e fiscaliza; CCEE viabiliza a contabilização e liquidação das operações; ONS coordena a operação do sistema.',
  comercializacao:'A organização se divide entre contratação regulada e livre. Contratos, contabilização e obrigações de cobertura conectam os agentes aos dois ambientes.',
  acl:'No ACL, compradores e vendedores negociam condições bilateralmente. A representação, o registro contratual e as regras de participação seguem a regulamentação vigente.',
  acr:'No ACR, distribuidoras contratam energia por mecanismos regulados, incluindo leilões. Os contratos resultantes seguem condições e prazos definidos para cada produto.',
  lastro:'A contratação deve guardar relação com a cobertura do consumo e com os requisitos de lastro. As regras de verificação e penalidade também dependem de normas complementares.',
  leiloes:'Os rótulos A-1, A-3 e A-5 indicam, conceitualmente, anos de antecedência em relação ao início do fornecimento. Produtos, calendários e condições variam conforme cada certame.',
  penalidades:'O descumprimento de obrigações pode gerar consequências regulatórias e comerciais. A apuração considera as regras aplicáveis ao agente, ao contrato e ao período.',
  quiz:'A elegibilidade ao ACL depende dos requisitos legais e regulatórios atuais. Use a pergunta como ponto de partida e confirme os critérios vigentes antes de tomar decisões.'
};

export default function App(){
  const [mode,setMode]=useState('2D'); const [selected,setSelected]=useState('comercializacao'); const [query,setQuery]=useState(''); const [persona,setPersona]=useState('todos'); const [activeLayers,setActiveLayers]=useState(Object.keys(layerLabels)); const [drawer,setDrawer]=useState(true); const [zoom,setZoom]=useState(1); const [toast,setToast]=useState('');
  const [tutorialOpen,setTutorialOpen]=useState(()=>sessionStorage.getItem('map-tutorial-dismissed')!=='1');
  const [dark,setDark]=useState(()=>localStorage.getItem('mapa-theme')==='dark'); const [flippedNodes,setFlippedNodes]=useState({});
  const clickTimers=useRef(new Map());
  const nodeElements=useRef(new Map());
  const [worldEdges,setWorldEdges]=useState([]);
  const [camera,setCamera]=useState({x:17,y:-20,panX:0,panY:0,zoom:1});
  const drag=useRef(null);
  const stageRef=useRef(null);
  const [stageSize,setStageSize]=useState({width:0,height:0});
  const [nodeHeights,setNodeHeights]=useState({});
  const [focusedNode,setFocusedNode]=useState(null);
  const [focusOffset,setFocusOffset]=useState({x:0,y:0,scale:1});
  useEffect(()=>{
    const stage=stageRef.current;
    if(!stage||typeof ResizeObserver==='undefined')return;
    const observer=new ResizeObserver(([entry])=>{
      const {width,height}=entry.contentRect;
      setStageSize(size=>size.width===width&&size.height===height?size:{width,height});
    });
    observer.observe(stage);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>()=>{
    clickTimers.current.forEach(timer=>window.clearTimeout(timer));
    clickTimers.current.clear();
  },[]);
  const resetCamera=()=>setCamera({x:17,y:-20,panX:0,panY:persona==='todos'||persona==='operacional' ? -150 : 0,zoom:persona==='todos'||persona==='operacional' ? .65 : 1});
  useEffect(()=>{
    if(mode==='3D'&&(persona==='todos'||persona==='operacional'))setCamera(c=>({...c,panY:-150,zoom:Math.min(c.zoom,.65)}));
  },[mode,persona]);
  const onPointerDown=(e)=>{if(mode!=='3D'||e.target.closest('button'))return;drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,panX:camera.panX,panY:camera.panY,rotX:camera.x,rotY:camera.y,button:e.button};e.currentTarget.setPointerCapture(e.pointerId)};
  const onPointerMove=(e)=>{if(!drag.current||drag.current.id!==e.pointerId)return;const d=drag.current;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(d.button===2||e.shiftKey)setCamera(c=>({...c,panX:d.panX+dx,panY:d.panY+dy}));else setCamera(c=>({...c,y:d.rotY+dx*.45,x:Math.max(-5,Math.min(75,d.rotX-dy*.35))}))};
  const onPointerUp=(e)=>{if(drag.current?.id===e.pointerId)drag.current=null};
  const onWheel=(e)=>{if(mode!=='3D')return;e.preventDefault();e.stopPropagation();setCamera(c=>({...c,zoom:Math.max(.55,Math.min(2.2,c.zoom*(e.deltaY<0?1.08:.92)))}))};
  const toggleNodeFocus=(e,node)=>{
    e.stopPropagation();
    if(focusedNode===node.id){setFocusedNode(null);setFocusOffset({x:0,y:0,scale:1});return}
    const stage=e.currentTarget.closest('.map-stage'),stageRect=stage.getBoundingClientRect();
    const scale=zoom*1.65;
    setFocusOffset({x:(.5-node.x/100)*stageRect.width*scale,y:(.5-node.y/100)*stageRect.height*scale,scale});
    setFocusedNode(node.id);
  };
  const toggleTheme=()=>setDark(v=>{localStorage.setItem('mapa-theme',v?'light':'dark');return !v});
  const changeMode=next=>{setFocusedNode(null);setFocusOffset({x:0,y:0,scale:1});setMode(next)};
  const closeTutorial=()=>{sessionStorage.setItem('map-tutorial-dismissed','1');setTutorialOpen(false)};
  useEffect(()=>{
    if(!tutorialOpen)return;
    const onKeyDown=event=>{if(event.key==='Escape')closeTutorial()};
    window.addEventListener('keydown',onKeyDown);
    return()=>window.removeEventListener('keydown',onKeyDown);
  },[tutorialOpen]);
  const activeNodes=persona==='operacional'?operationalNodes:persona==='gerador'?generatorNodes:persona==='todos'?allCategoryNodes:nodes;
  const activeEdges=persona==='operacional'?operationalEdges:persona==='gerador'?generatorEdges:persona==='todos'?allCategoryEdges:edges;
  const filtered=useMemo(()=>activeNodes.filter(n=>n.title.toLowerCase().includes(query.toLowerCase())||n.short.toLowerCase().includes(query.toLowerCase())||n.detailText?.toLowerCase().includes(query.toLowerCase())),[query,activeNodes]);
  const backFacing=mode==='3D'&&Math.cos(camera.x*Math.PI/180)*Math.cos(camera.y*Math.PI/180)<0;
  const visible=(n)=>n&&(activeLayers.includes(n.layer)||n.id==='root'||n.id==='op-root'||n.id==='gen-root');
  const operationalStageHeight=useMemo(()=>{
    if(persona!=='operacional'||mode!=='3D'||!backFacing)return 1180;
    const columns=new Map();
    operationalNodes.forEach(node=>{
      const column=columns.get(node.x)||[];
      column.push(node);
      columns.set(node.x,column);
    });
    const estimateHeight=node=>{
      const lines=(node.detailText||'').split('\n').reduce((total,line)=>total+Math.max(1,Math.ceil(line.length/29)),0);
      return nodeHeights[node.id]||Math.max(78,42+lines*12);
    };
    const tallestColumn=Math.max(...[...columns.values()].map(column=>column.reduce((sum,node)=>sum+estimateHeight(node),0)+Math.max(0,column.length-1)*30));
    return Math.max(1180,Math.ceil(tallestColumn+120));
  },[persona,mode,backFacing,nodeHeights]);
  const positionedNodes=useMemo(()=>{
    if(!stageSize.width||!stageSize.height)return activeNodes;
    if(persona==='operacional'&&mode==='2D'){
      const operational2DY={
        'op-finalidade-nota':6,'op-agentes-nota':17,'op-ambientes-nota':28,
        'op-acr-nota':39,'op-acl-nota':50,'op-lastro-nota':61,
        'op-garantia-nota':72,'op-gd-nota':83,'op-leiloes-nota':94,
        'op-finalidade':10,'op-principios':23,'op-agentes':36,'op-ambientes':49,
        'op-geracao':62,'op-geracao-distribuida':75,'op-leiloes':87,'op-ccear':97,
        'op-fundamentos':27,'op-geracao-contratacao':77,
        'op-mercado-distribuicao':27,'op-regulacao-resultados':77,
        'op-comercializacao':12,'op-distribuicao':26,'op-consumidor-livre':40,
        'op-sobras-deficits':54,'op-curto-prazo':67,'op-repasse-tarifario':79,
        'op-lastro-penalidades':90,'op-outorgas':98,
        'op-registro-nota':6,'op-diretrizes-nota':19,'op-distribuidoras-nota':32,
        'op-excecoes-nota':45,'op-migracao-nota':58,'op-pld-nota':71,
      };
      return activeNodes.map(node=>({...node,y:operational2DY[node.id]??node.y}));
    }
    const compact2D=mode==='2D'&&stageSize.width/zoom<1080;
    if(compact2D&&persona!=='todos'&&persona!=='operacional'){
      const compactPositions={
        root:[55,45],instituicoes:[50,18],comercializacao:[13,43],
        acl:[12,63],acr:[50,63],lastro:[81,32],penalidades:[88,63],
        leiloes:[50,88],quiz:[12,88]
      };
      const edgePadding=Math.min(25,(115/stageSize.width)*100);
      return activeNodes.map(n=>{
        const [x,y]=compactPositions[n.id]||[n.x,n.y];
        return {...n,x:Math.max(edgePadding,Math.min(100-edgePadding,x)),y};
      });
    }
    if(persona==='gerador'&&mode==='2D'){
      const columns=new Map();
      activeNodes.forEach(node=>{
        const key=`${node.x}:${node.y<53?'upper':'lower'}`;
        const column=columns.get(key)||[];
        column.push(node);
        columns.set(key,column);
      });
      const columnY=new Map();
      columns.forEach(column=>{
        if(column.length<2)return;
        column.sort((a,b)=>a.y-b.y);
        const heights=column.map(node=>nodeHeights[node.id]||64);
        const gap=18;
        const contentHeight=heights.reduce((sum,height)=>sum+height,0)+gap*(column.length-1);
        const center=column.reduce((sum,node)=>sum+node.y,0)/column.length/100*stageSize.height;
        const top=Math.max(12,Math.min(stageSize.height-contentHeight-12,center-contentHeight/2));
        let cursor=top;
        column.forEach((node,index)=>{
          columnY.set(node.id,(cursor+heights[index]/2)/stageSize.height*100);
          cursor+=heights[index]+gap;
        });
      });
      return activeNodes.map(node=>({...node,y:columnY.get(node.id)??node.y}));
    }
    if(mode!=='3D')return activeNodes;
    const spreadX=Math.min(1.3,Math.max(1,1500/stageSize.width));
    const sidePadding=Math.min(18,(125/stageSize.width)*100);
    const turnedOver=Math.cos(camera.x*Math.PI/180)*Math.cos(camera.y*Math.PI/180)<0;
    const columnY=new Map();
    if(persona==='todos'||persona==='operacional'||persona==='gerador'){
      const columns=new Map();
      activeNodes.forEach(n=>{
        const columnKey=persona==='gerador'?`${n.x}:${n.y<53?'upper':'lower'}`:n.x;
        const column=columns.get(columnKey)||[];
        column.push(n);
        columns.set(columnKey,column);
      });
      columns.forEach(column=>{
        if(column.length<2)return;
        column.sort((a,b)=>a.y-b.y);
        if(persona==='operacional'&&turnedOver){
          const heights=column.map(n=>nodeHeights[n.id]||Math.max(78,42+(n.detailText||'').split('\n').reduce((total,line)=>total+Math.max(1,Math.ceil(line.length/29)),0)*12));
          const gap=30;
          const contentHeight=heights.reduce((sum,height)=>sum+height,0)+gap*(column.length-1);
          const center=column.reduce((sum,n)=>sum+n.y,0)/column.length/100*operationalStageHeight;
          const top=Math.max(55,Math.min(operationalStageHeight-contentHeight-55,center-contentHeight/2));
          let cursor=top;
          column.forEach((n,index)=>{
            columnY.set(n.id,(cursor+heights[index]/2)/operationalStageHeight*100);
            cursor+=heights[index]+gap;
          });
          return;
        }
        if(persona==='gerador'&&turnedOver){
          const heights=column.map(n=>nodeHeights[n.id]||Math.max(78,42+(n.detailText||'').split('\n').reduce((total,line)=>total+Math.max(1,Math.ceil(line.length/31)),0)*12));
          const gap=18;
          const contentHeight=heights.reduce((sum,height)=>sum+height,0)+gap*(column.length-1);
          const center=column.reduce((sum,n)=>sum+n.y,0)/column.length/100*stageSize.height;
          const top=Math.max(35,Math.min(stageSize.height-contentHeight-35,center-contentHeight/2));
          let cursor=top;
          column.forEach((n,index)=>{
            columnY.set(n.id,(cursor+heights[index]/2)/stageSize.height*100);
            cursor+=heights[index]+gap;
          });
          return;
        }
        const layoutHeight=persona==='operacional'?operationalStageHeight:stageSize.height;
        const minGap=Math.min(Math.max(21,Math.min(26,150/layoutHeight*100)),88/(column.length-1));
        const span=(column.length-1)*minGap;
        const center=column.reduce((sum,n)=>sum+n.y,0)/column.length;
        const start=Math.max(6,Math.min(94-span,center-span/2));
        column.forEach((n,index)=>columnY.set(n.id,start+index*minGap));
      });
    }
    return activeNodes.map(n=>{
      let x=50+(n.x-50)*spreadX;
      let y=columnY.get(n.id)??n.y;
    if(persona!=='todos'&&persona!=='operacional'){
        if(n.id==='acl')x=26.5-(11.5*spreadX);
        if(n.id==='acr')x=26.5+(11.5*spreadX);
        if(n.id==='leiloes')x=turnedOver?55:31;
        if(n.id==='leiloes'||n.id==='quiz')y=Math.min(98,y+6);
      }
      return {...n,x:Math.max(sidePadding,Math.min(100-sidePadding,x)),y};
    });
  },[mode,stageSize,camera.x,camera.y,zoom,persona,activeNodes,nodeHeights,operationalStageHeight]);
  const positionedById=useMemo(()=>new Map(positionedNodes.map(n=>[n.id,n])),[positionedNodes]);
  useLayoutEffect(()=>{
    if(!(persona==='operacional'&&mode==='3D'&&backFacing)&&persona!=='gerador')return;
    const next={};
    activeNodes.forEach(node=>{
      const element=nodeElements.current.get(node.id);
      if(element)next[node.id]=element.offsetHeight;
    });
    setNodeHeights(previous=>Object.keys(next).length===Object.keys(previous).length&&Object.entries(next).every(([id,height])=>previous[id]===height)?previous:next);
  },[persona,mode,backFacing,flippedNodes,operationalStageHeight,stageSize,activeNodes]);
  const pick=(id)=>{setSelected(id);setDrawer(true)};
  const handleNodeClick=(node)=>{
    pick(node.id);
    if(persona!=='todos'&&persona!=='operacional'&&persona!=='gerador')return;
    const previous=clickTimers.current.get(node.id);
    if(previous)window.clearTimeout(previous);
    const timer=window.setTimeout(()=>{
      setFlippedNodes(v=>({...v,[node.id]:!v[node.id]}));
      clickTimers.current.delete(node.id);
    },250);
    clickTimers.current.set(node.id,timer);
  };
  const handleNodeDoubleClick=(event,node)=>{
    const pending=clickTimers.current.get(node.id);
    if(pending){window.clearTimeout(pending);clickTimers.current.delete(node.id)}
    toggleNodeFocus(event,node);
  };
  const toggleLayer=(id)=>setActiveLayers(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  const current=activeNodes.find(n=>n.id===selected)||activeNodes[0];
  useLayoutEffect(()=>{
    if(mode!=='3D')return;
    const width=stageSize.width,height=persona==='operacional'?operationalStageHeight:stageSize.height;
    if(!width||!height)return;
    const cards=new Map();
    positionedNodes.filter(visible).forEach(node=>{
      const element=nodeElements.current.get(node.id);
      if(!element)return;
      cards.set(node.id,{
        x:node.x/100*width,y:node.y/100*height,
        halfWidth:element.offsetWidth/2,halfHeight:element.offsetHeight/2,
        z:mode==='3D'?(Number(node.z)||0):0
      });
    });
    const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
    const nextEdges=activeEdges.filter(([a,b])=>visible(positionedById.get(a))&&visible(positionedById.get(b))).flatMap(([a,b])=>{
      const cardA=cards.get(a),cardB=cards.get(b);
      if(!cardA||!cardB)return [];
      const dx=cardB.x-cardA.x,dy=cardB.y-cardA.y;
      let start,end;
      if(persona==='operacional'||Math.abs(dx)>=Math.abs(dy)){
        const direction=Math.sign(dx)||1;
        start={x:cardA.x+direction*cardA.halfWidth,y:clamp(cardB.y,cardA.y-cardA.halfHeight+8,cardA.y+cardA.halfHeight-8),z:cardA.z};
        end={x:cardB.x-direction*cardB.halfWidth,y:clamp(cardA.y,cardB.y-cardB.halfHeight+8,cardB.y+cardB.halfHeight-8),z:cardB.z};
      }else{
        const direction=Math.sign(dy)||1;
        start={x:clamp(cardB.x,cardA.x-cardA.halfWidth+8,cardA.x+cardA.halfWidth-8),y:cardA.y+direction*cardA.halfHeight,z:cardA.z};
        end={x:clamp(cardA.x,cardB.x-cardB.halfWidth+8,cardB.x+cardB.halfWidth-8),y:cardB.y-direction*cardB.halfHeight,z:cardB.z};
      }
      const vx=end.x-start.x,vy=end.y-start.y,vz=end.z-start.z;
      const length=Math.hypot(vx,vy,vz);
      const angleZ=Math.atan2(vy,vx)*180/Math.PI;
      const angleY=-Math.atan2(vz,Math.hypot(vx,vy))*180/Math.PI;
      return [{id:`${a}-${b}`,edgeClass:`edge-3d ${a==='comercializacao'||b==='comercializacao'?'edge-active':''}`,style:{left:start.x,top:start.y,width:length,transform:`translate3d(0,0,${start.z}px) rotateZ(${angleZ}deg) rotateY(${angleY}deg)`}}];
    });
    setWorldEdges(previous=>previous.length===nextEdges.length&&previous.every((edge,index)=>edge.id===nextEdges[index].id&&edge.style.left===nextEdges[index].style.left&&edge.style.top===nextEdges[index].style.top&&edge.style.width===nextEdges[index].style.width&&edge.style.transform===nextEdges[index].style.transform)?previous:nextEdges);
  },[mode,positionedNodes,positionedById,activeEdges,activeLayers,stageSize,flippedNodes,backFacing,persona,operationalStageHeight]);
  return <main className={`app-shell ${dark?'dark':''}`}>
    <header className="topbar">
      <label className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar"/></label>
      <div className="top-actions"><button className="persona-select"><span className="avatar"><Eye size={14}/></span>{personas.find(p=>p.id===persona)?.label}<ChevronDown size={14}/><select aria-label="Selecionar persona" value={persona} onChange={e=>setPersona(e.target.value)}>{personas.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></button><div className="mode-switch"><button className={mode==='2D'?'active':''} onClick={()=>changeMode('2D')}><Network size={15}/> 2D</button><button className={mode==='3D'?'active':''} onClick={()=>changeMode('3D')}><Orbit size={15}/> 3D</button></div><button className="icon-button tutorial-trigger" title="Abrir tutorial" aria-label="Abrir tutorial" onClick={()=>setTutorialOpen(true)}><CircleHelp size={17}/></button><button className="icon-button" title={dark?'Ativar tema claro':'Ativar tema escuro'} aria-label={dark?'Ativar tema claro':'Ativar tema escuro'} onClick={toggleTheme}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button></div>
    </header>
    <div className={`workspace ${persona==='todos'||persona==='operacional'||persona==='gerador'?'all-category':''}`}>
      {persona!=='gerador'&&<aside className="layer-panel"><div className="panel-heading"><span>EXPLORAR</span><button className="quiet-button"><SlidersHorizontal size={15}/></button></div><div className="panel-section"><p className="section-label">CAMADAS</p>{Object.entries(layerLabels).map(([id,label])=><label className="layer-row" key={id}><input type="checkbox" checked={activeLayers.includes(id)} onChange={()=>toggleLayer(id)}/><span className={`layer-dot ${id}`}/><span>{label}</span><small>{activeNodes.filter(n=>n.layer===id).length}</small></label>)}</div><div className="panel-section persona-list"><p className="section-label">VER COMO</p>{personas.map(({id,label,icon:Icon})=><button key={id} className={`persona-row ${persona===id?'chosen':''}`} onClick={()=>setPersona(id)}><Icon size={15}/>{label}{persona===id&&<span className="selected-dot"/>}</button>)}</div><div className="legend"><p className="section-label">LEGENDA</p><div><i className="legend-node"/> Conceito</div><div><i className="legend-ring"/> Decisão interativa</div><div><i className="legend-line"/> Relação no decreto</div></div></aside>}
      <section className={`canvas-area ${mode==='3D'?'scene-3d':''} ${persona==='operacional'?'operational-map':''} ${persona==='gerador'?'generator-map':''}`} aria-label={`Mapa regulatório ${persona==='operacional'?'operacional':persona==='gerador'?'do gerador':''} em ${mode}`}>
        <div className="canvas-toolbar"><div className="crumb"><span>Mapa mental</span><span className="crumb-sep">/</span><strong>{mode} · Visão geral</strong></div><div className="canvas-tools">{mode==='3D'?<><button className="square-tool" onClick={()=>setCamera(c=>({...c,zoom:Math.max(.55,c.zoom-.1)}))}><Minus size={15}/></button><span className="zoom-label">{Math.round(camera.zoom*100)}%</span><button className="square-tool" onClick={()=>setCamera(c=>({...c,zoom:Math.min(2.2,c.zoom+.1)}))}><Plus size={15}/></button><button className="square-tool" onClick={resetCamera} title="Recentralizar câmera"><LocateFixed size={15}/></button></>:<><button className="square-tool" onClick={()=>setZoom(Math.max(.8,zoom-.1))}><Minus size={15}/></button><span className="zoom-label">{Math.round(zoom*100)}%</span><button className="square-tool" onClick={()=>setZoom(Math.min(1.2,zoom+.1))}><Plus size={15}/></button><button className="square-tool" onClick={()=>{setZoom(1);pick(persona==='operacional'?'op-root':persona==='gerador'?'gen-root':'root')}} title="Recentralizar"><LocateFixed size={15}/></button></>}</div></div>
        {query&&<div className="search-results"><div className="result-head">{filtered.length} resultados</div>{filtered.map(n=><button key={n.id} onClick={()=>{pick(n.id);if(persona==='todos'||persona==='operacional'||persona==='gerador')setFlippedNodes(v=>({...v,[n.id]:true}));setQuery('')}}><Search size={14}/><span><strong>{n.title}</strong><small>{n.article}</small></span><ArrowUpRight size={14}/></button>)}</div>}
        <div ref={stageRef} className={`map-stage ${mode==='3D'?'interactive-3d':''} ${backFacing?'back-facing':''} ${focusedNode&&mode==='2D'?'focus-active':''}`} style={{'--map-scale':zoom,'--rot-x':`${camera.x}deg`,'--rot-y':`${camera.y}deg`,'--pan-x':`${camera.panX}px`,'--pan-y':`${camera.panY}px`,'--camera-zoom':camera.zoom,'--focus-x':`${focusOffset.x}px`,'--focus-y':`${focusOffset.y}px`,'--focus-scale':focusOffset.scale,'--operational-world-height':`${operationalStageHeight}px`}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onContextMenu={e=>{if(mode==='3D')e.preventDefault()}} onWheel={onWheel}><div className="map-world"><div className="map-grid"/>{mode==='3D'?<div className="edges-3d">{worldEdges.map(edge=><span key={edge.id} className={edge.edgeClass} style={edge.style}/>)}</div>:<svg className="edges" viewBox="0 0 1000 700" preserveAspectRatio="none">{activeEdges.filter(([a,b])=>visible(positionedById.get(a))&&visible(positionedById.get(b))).map(([a,b])=>{const na=positionedById.get(a),nb=positionedById.get(b),edgeClass=`edge ${a==='comercializacao'||b==='comercializacao'||a==='gen-root'||b==='gen-root'?'edge-active':''}`;if(persona==='todos'||persona==='operacional'||persona==='gerador'){const bend=(nb.x-na.x)*5;return <path key={a+b} d={`M ${na.x*10} ${na.y*7} C ${na.x*10+bend} ${na.y*7}, ${nb.x*10-bend} ${nb.y*7}, ${nb.x*10} ${nb.y*7}`} className={edgeClass}/>;}return <line key={a+b} x1={na.x*10} y1={na.y*7} x2={nb.x*10} y2={nb.y*7} className={edgeClass}/>;})}</svg>}
          <div className="map-nodes">
            {positionedNodes.filter(visible).map((n,i)=>{
              const showBack=persona==='todos'||persona==='operacional'||persona==='gerador'?Boolean(flippedNodes[n.id])!==backFacing:backFacing;
              const cardText=n.detailText||nodeInsights[n.id]||n.summary;
              return <button key={n.id} ref={element=>element?nodeElements.current.set(n.id,element):nodeElements.current.delete(n.id)} onClick={()=>handleNodeClick(n)} onDoubleClick={e=>handleNodeDoubleClick(e,n)} disabled={mode==='3D'} title={mode==='3D'?'Interação indisponível no modo 3D':persona==='todos'||persona==='operacional'||persona==='gerador'?'Clique para ver detalhes; duplo clique para focar':focusedNode===n.id?'Clique duas vezes para voltar ao enquadramento':'Clique duas vezes para aproximar e focar'} aria-label={`${n.title}: ${showBack?'verso do card':'frente do card'}`} className={`map-node ${n.kind} ${n.id.startsWith('op-')?`operational-node op-${n.operationalKind==='note-institutions'?'note':n.operationalKind} ${n.operationalKind==='note-institutions'?'op-note-institutions ':''}`:''} ${selected===n.id?'selected':''} ${focusedNode===n.id?'focused':''} ${showBack?'showing-back':''} ${persona!=='todos'&&persona!=='operacional'&&persona!=='gerador'&&((persona==='consumidor'&&n.env==='ACR')||(persona==='distribuidor'&&n.env==='ACL'))?'dimmed':''}`} style={{left:`${n.x}%`,top:`${n.y}%`,'--z':`${n.z}px`,'--delay':`${i*45}ms`}}>
                <span className={`node-face-content ${showBack?'back-content':''}`}>
                  {showBack?<span className="node-back-content"><span className="node-back-kicker">DETALHES</span><strong>{n.title}</strong>{persona!=='todos'&&persona!=='operacional'&&<small>{n.article}</small>}<span>{cardText}</span></span>:<><span className="node-icon">{n.kind==='timeline'?<Clock3 size={15}/>:n.kind==='quiz'?<Sparkles size={15}/>:n.id==='root'||n.id==='op-root'||n.id==='gen-root'?<Network size={17}/>:<GitBranch size={15}/>}</span><span className="node-copy"><strong>{n.title}</strong>{n.short&&<small>{n.short}</small>}</span>{(n.id==='root'||n.id==='op-root'||n.id==='gen-root')&&<span className="root-badge">NORMA</span>}</>}
                </span>
              </button>;
            })}
          </div>
          <div className="map-caption"><span className="caption-line"/> Relações entre temas <span className="caption-dot"/> {mode==='2D'?'Mapa topológico':'Profundidade hierárquica'}</div>
          </div>{mode==='3D'&&<div className="view-cube"><button className="cube" onClick={resetCamera} title="Restaurar vista"><span>TOPO</span><i/><b/><em/></button><small>ARRASTE PARA ORBITAR</small></div>}
        </div>
        <div className="bottom-bar"><a className="course-link" href="https://academy.ccee.org.br/" target="_blank" rel="noopener noreferrer"><GraduationCap size={16}/><span><strong>Aprofunde o tema</strong><small>Academy CCEE</small></span><ArrowUpRight size={14}/></a><div className="bottom-crumb"><span>Decreto 5.163</span><span>›</span><strong>{current.title}</strong></div>{mode==='3D'&&<div className="interaction-hint"><Orbit size={13}/> Arrastar: orbitar <span>·</span> Shift + arrastar: mover <span>·</span> Scroll: zoom</div>}<button className="mini-map" onClick={()=>{setZoom(1);pick(persona==='operacional'?'op-root':persona==='gerador'?'gen-root':'root')}} title="Minimapa"><span className="mini-line l1"/><span className="mini-line l2"/><i/><b/></button></div>
      </section>
      {drawer&&persona!=='todos'&&persona!=='gerador'&&<aside className="detail-panel"><div className="detail-top"><div><span className="section-label">DETALHE DO TEMA</span><button className="close-drawer" onClick={()=>setDrawer(false)}><PanelRightClose size={17}/></button></div><span className="category-chip"><i className={`layer-dot ${current.layer}`}/>{layerLabels[current.layer]}</span></div><div className="detail-content"><div className="detail-icon"><BookOpen size={19}/></div><h1>{current.title}</h1><p className="detail-subtitle">{current.short}</p><div className="article-ref"><span>REFERÊNCIA</span><strong>{current.article}</strong><button title="Abrir referência"><ArrowUpRight size={14}/></button></div><h3>Visão geral</h3><p className="summary">{current.summary||current.detailText}</p>{current.id==='leiloes'&&<div className="timeline"><span>A-5</span><i/><span>A-3</span><i/><span>A-1</span><small>Antecedência do início do fornecimento</small></div>}{current.id==='quiz'&&<div className="quiz-card"><strong>Qual perfil descreve você?</strong><button onClick={()=>setToast('Consulte os requisitos vigentes antes de tomar uma decisão.')}>Sou consumidor de energia <ArrowUpRight size={14}/></button><small>Esta trilha é educativa. Confira a regulamentação vigente.</small></div>}<button className="open-article" onClick={()=>setToast('Referência pronta para consulta no texto oficial.')}>Ver contexto no decreto <ArrowUpRight size={15}/></button><div className="related"><span>RELACIONADOS</span>{activeNodes.filter(n=>n.id!==current.id&&activeEdges.some(e=>e.includes(current.id)&&e.includes(n.id))).slice(0,3).map(n=><button key={n.id} onClick={()=>pick(n.id)}>{n.title}<ArrowUpRight size={13}/></button>)}</div></div></aside>}
    </div>{toast&&<div className="toast"><span className="live-dot"/>{toast}<button onClick={()=>setToast('')}><X size={14}/></button></div>}
    {tutorialOpen&&<div className="tutorial-overlay" onMouseDown={event=>{if(event.target===event.currentTarget)closeTutorial()}}><section className="tutorial-modal" role="dialog" aria-modal="true" aria-labelledby="tutorial-title"><button className="tutorial-close" onClick={closeTutorial} aria-label="Fechar tutorial"><X size={18}/></button><div className="tutorial-heading"><span className="tutorial-mark"><Compass size={21}/></span><div><span className="tutorial-eyebrow">GUIA RÁPIDO</span><h2 id="tutorial-title">Explore o mapa mental</h2><p>Escolha uma visão e navegue pelos temas no seu ritmo.</p></div></div><div className="tutorial-grid"><article className="tutorial-card"><span className="tutorial-icon"><SlidersHorizontal size={17}/></span><div><h3>Altere os filtros</h3><p>Abra o menu no topo da tela e escolha outra visão. O mapa se atualiza automaticamente.</p></div></article><article className="tutorial-card"><span className="tutorial-icon"><Network size={17}/></span><div><h3>Navegue em 2D</h3><p>Use <b>+</b> e <b>−</b> para ajustar o zoom. Clique em um card para ver seus detalhes; dê dois cliques para aproximar e centralizar nele.</p></div></article><article className="tutorial-card"><span className="tutorial-icon"><Orbit size={17}/></span><div><h3>Navegue em 3D</h3><p>Arraste com o botão esquerdo para orbitar. Use <b>Shift + arrastar</b> ou o botão direito para mover, e o scroll ou <b>+</b>/<b>−</b> para zoom. O botão de alvo restaura a vista. Os cards não têm ações de clique em 3D.</p></div></article></div><div className="tutorial-footer"><span><MousePointer2 size={14}/> Dica: use o botão <CircleHelp size={14}/> no topo para abrir este guia novamente.</span><button className="tutorial-start" onClick={closeTutorial}>Entendi, começar</button></div></section></div>}
  </main>
}
