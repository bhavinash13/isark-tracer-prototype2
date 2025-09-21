// data/mockData.ts

export const users = [
  { email: "farmer1@example.com", password: "1234", role: "farmer", id: "f1" },
  { email: "farmer2@example.com", password: "1234", role: "farmer", id: "f2" },
  { email: "lab1@example.com", password: "1234", role: "lab", id: "lab1" },
  { email: "proc1@example.com", password: "1234", role: "processor", id: "proc1" },
  { email: "regulator@example.com", password: "1234", role: "regulator", id: "reg1" },
];

export const mockData = {
  farmers: [
    {
      id: "f1",
      name: "Farmer A",
      village: "Village X",
      location: { lat: 25.123, lng: 85.456 },
      products: [
        {
          id: "p1",
          name: "Ashwagandha",
          stage: "Harvested",
          photos: ["ashwagandha1.jpg", "ashwagandha2.jpg"],
          iotMetrics: { temperature: 25, humidity: 60, timestamp: "2025-09-21T10:00:00Z" },
          labResults: { moisture: null, pesticide: null, dna: null },
          processingSteps: [],
        },
      ],
    },
    {
      id: "f2",
      name: "Farmer B",
      village: "Village Y",
      location: { lat: 26.456, lng: 84.789 },
      products: [
        {
          id: "p2",
          name: "Brahmi",
          stage: "Harvested",
          photos: ["brahmi1.jpg"],
          iotMetrics: { temperature: 24, humidity: 55, timestamp: "2025-09-21T11:30:00Z" },
          labResults: { moisture: null, pesticide: null, dna: null },
          processingSteps: [],
        },
      ],
    },
  ],

  labs: [
    {
      id: "lab1",
      name: "Lab Tester A",
      assignedBatches: ["p1", "p2"],
    },
  ],

  processors: [
    {
      id: "proc1",
      name: "Processor A",
      assignedBatches: ["p1", "p2"],
    },
  ],

  regulators: [
    {
      id: "reg1",
      name: "Regulator X",
    },
  ],
};
