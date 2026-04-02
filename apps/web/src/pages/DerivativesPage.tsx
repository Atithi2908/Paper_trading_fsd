import HeaderInfoPage from './HeaderInfoPage';

export default function DerivativesPage() {
  return (
    <HeaderInfoPage
      title="Derivatives"
      subtitle="Track futures and options-focused metrics with quick context on risk, leverage, and participation."
      snapshots={[
        { title: 'Open Interest', value: '$1.4B', note: 'Major contracts combined' },
        { title: 'Funding Rate', value: '0.012%', note: '8H rolling average' },
        { title: 'Max Leverage Used', value: '10x', note: 'Risk managed per symbol' },
      ]}
      faqs={[
        {
          question: 'What is shown in the derivatives snapshots?',
          answer: 'You get a concise view of open interest, funding behavior, and leverage usage at a glance.',
        },
        {
          question: 'Is leverage always available at maximum levels?',
          answer: 'No. Leverage availability depends on symbol liquidity and internal risk controls.',
        },
        {
          question: 'Can new users start with derivatives immediately?',
          answer: 'Yes, after account setup, but using lower leverage is recommended until strategy performance is stable.',
        },
      ]}
    />
  );
}