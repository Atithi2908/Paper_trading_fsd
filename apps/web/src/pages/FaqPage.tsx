import HeaderInfoPage from './HeaderInfoPage';

export default function FaqPage() {
  return (
    <HeaderInfoPage
      title="FAQ"
      subtitle="Find answers to common platform, security, and account questions in one place."
      snapshots={[
        { title: 'Top Questions', value: '120+', note: 'Curated from user support' },
        { title: 'Avg Resolution Time', value: '4 min', note: 'For common account issues' },
        { title: 'Help Satisfaction', value: '96%', note: 'Based on support feedback' },
      ]}
      faqs={[
        {
          question: 'How do I start trading after signup?',
          answer: 'Complete account setup, verify your profile details, and then open a market from the main dashboard.',
        },
        {
          question: 'Where can I review my orders and fills?',
          answer: 'Use the order and trade history pages available after login to track status and execution details.',
        },
        {
          question: 'Is account security enabled by default?',
          answer: 'Core protections are enabled by default, and you can further strengthen access with additional verification options.',
        },
      ]}
    />
  );
}