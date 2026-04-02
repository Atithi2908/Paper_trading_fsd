import HeaderInfoPage from './HeaderInfoPage';

export default function ExchangePage() {
  return (
    <HeaderInfoPage
      title="Exchange"
      subtitle="Monitor spot pairs, depth behavior, and execution quality with a clean view of market activity."
      snapshots={[
        { title: '24H Spot Volume', value: '$2.8B', note: 'Across major pairs' },
        { title: 'Avg Spread', value: '0.06%', note: 'Top 25 traded assets' },
        { title: 'Order Match Speed', value: '18 ms', note: 'Median execution latency' },
      ]}
      faqs={[
        {
          question: 'What can I trade on the Exchange page?',
          answer: 'The page summarizes spot trading coverage and execution metrics for listed crypto and equity-style instruments.',
        },
        {
          question: 'How often are snapshots refreshed?',
          answer: 'Snapshots are designed to represent live-style platform metrics and can be refreshed frequently in production feeds.',
        },
        {
          question: 'Do I need a funded account to view Exchange data?',
          answer: 'No. You can browse snapshots and FAQs without funding, but placing orders requires account access.',
        },
      ]}
    />
  );
}