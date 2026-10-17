/**
 * Three situations a real reader of these guides arrives in.
 *
 * Each question was run against the full corpus and kept only if the guides
 * answer it well. Nothing is scoped or filtered: the assistant searches all
 * five guides, exactly as a customer-facing agent would.
 */
export const SCENARIOS = [
  {
    id: 's1',
    tab: 'The data is incomplete',
    problem:
      'A reconciliation analyst is reviewing Security mappings and notices that some Positions carry an ISIN on one side and nothing on the other. Before accepting any of those matches, they need to know what the engine does with a value that is simply not there.',
    question: 'What happens when a Security value is missing on one side?',
  },
  {
    id: 's2',
    tab: 'One Transaction, two groups',
    problem:
      'A reconciliation analyst is reviewing matched Transaction groups and finds the same Transaction sitting in more than one of them. Before raising it as a defect, they need to know whether the engine does this deliberately, and on what basis it decides to link groups at all.',
    question: 'How does Cross Grouping link Transaction groups?',
  },
  {
    id: 's3',
    tab: 'Does it meet our device policy',
    problem:
      'A security reviewer is clearing the Approver mobile application for the treasury team. Their device policy has one hard rule about unmanaged hardware, and they need a direct answer before signing anything.',
    question: 'Does the Approver app work on jailbroken devices?',
  },
];
