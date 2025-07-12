export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface Edge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export const malawiDistrictsData: GraphData = {
  nodes: [
    { id: "Blantyre", x: 0.9134213014976535, y: 0.2540740323898225 },
    { id: "Chikwawa", x: 0.14374226893980302, y: 0.3910154112946962 },
    { id: "Chiradzulu", x: 0.9351749046225152, y: 0.5027042682331085 },
    { id: "Chitipa", x: 0.5033532302137712, y: 0.6371050642113303 },
    { id: "Dedza", x: 0.32675593364689126, y: 0.32741458873737384 },
    { id: "Dowa", x: 0.44893854232683894, y: 0.3534310438093927 },
    { id: "Karonga", x: 0.7719114930591756, y: 0.7164846847486838 },
    { id: "Kasungu", x: 0.9486271739760203, y: 0.03717616769235954 },
    { id: "Lilongwe", x: 0.03185092819745572, y: 0.07907784991666855 },
    { id: "Machinga", x: 0.4976553188158377, y: 0.15957191749775634 },
    { id: "Mangochi", x: 0.2417748469656349, y: 0.22132470346325728 },
    { id: "Mchinji", x: 0.8029651384628501, y: 0.4170419722297135 },
    { id: "Mulanje", x: 0.6998851394303303, y: 0.7300336822154281 },
    { id: "Mwanza", x: 0.3093976112949879, y: 0.9141857772478698 },
    { id: "Mzimba", x: 0.16190201617155997, y: 0.8356366262711726 },
    { id: "Neno", x: 0.9869012833729535, y: 0.3511167097222222 },
    { id: "Nkhata Bay", x: 0.0882233026546202, y: 0.18674223158715342 },
    { id: "Nkhotakota", x: 0.17467106409589772, y: 0.0010883823237957113 },
    { id: "Nsanje", x: 0.8093914854184416, y: 0.5079865816371467 },
    { id: "Ntcheu", x: 0.8588177668360885, y: 0.4167540312634731 },
    { id: "Ntchisi", x: 0.3969781197576786, y: 0.9982702660465445 },
    { id: "Phalombe", x: 0.934352810085411, y: 0.7328019939159007 },
    { id: "Rumphi", x: 0.2438492080065875, y: 0.0387865957339274 },
    { id: "Salima", x: 0.837201462046805, y: 0.9965726289086905 },
    { id: "Thyolo", x: 0.6272655175304893, y: 0.7688215502317457 },
    { id: "Zomba", x: 0.7252659639019722, y: 0.810888016094619 },
    { id: "Balaka", x: 0.15932838570160823, y: 0.5698123530031478 },
    { id: "Likoma", x: 0.3488343806746971, y: 0.6253864059894712 }
  ],
  edges: [
    { source: "Blantyre", target: "Chikwawa" },
    { source: "Blantyre", target: "Chiradzulu" },
    { source: "Blantyre", target: "Thyolo" },
    { source: "Chikwawa", target: "Nsanje" },
    { source: "Chikwawa", target: "Mwanza" },
    { source: "Chiradzulu", target: "Zomba" },
    { source: "Chiradzulu", target: "Phalombe" },
    { source: "Chitipa", target: "Karonga" },
    { source: "Dedza", target: "Lilongwe" },
    { source: "Dedza", target: "Ntcheu" },
    { source: "Dowa", target: "Lilongwe" },
    { source: "Dowa", target: "Ntchisi" },
    { source: "Karonga", target: "Rumphi" },
    { source: "Kasungu", target: "Lilongwe" },
    { source: "Kasungu", target: "Mzimba" },
    { source: "Lilongwe", target: "Mchinji" },
    { source: "Lilongwe", target: "Salima" },
    { source: "Machinga", target: "Zomba" },
    { source: "Machinga", target: "Balaka" },
    { source: "Mangochi", target: "Balaka" },
    { source: "Mangochi", target: "Salima" },
    { source: "Mulanje", target: "Phalombe" },
    { source: "Mulanje", target: "Thyolo" },
    { source: "Mwanza", target: "Neno" },
    { source: "Mzimba", target: "Nkhata Bay" },
    { source: "Mzimba", target: "Rumphi" },
    { source: "Nkhata Bay", target: "Nkhotakota" },
    { source: "Nkhotakota", target: "Salima" },
    { source: "Nsanje", target: "Chikwawa" },
    { source: "Ntcheu", target: "Balaka" },
    { source: "Ntchisi", target: "Nkhotakota" },
    { source: "Phalombe", target: "Mulanje" },
    { source: "Salima", target: "Nkhotakota" },
    { source: "Zomba", target: "Machinga" }
  ]
}; 