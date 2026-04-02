import HeaderInfoPage from './HeaderInfoPage';

export default function LearnPage() {
  return (
    <HeaderInfoPage
      title="Learn"
      subtitle="Build trading confidence with guided learning paths, risk modules, and strategy basics."
      snapshots={[
        { title: 'Learning Modules', value: '42', note: 'From beginner to advanced' },
        { title: 'Completion Rate', value: '78%', note: 'Active learners this month' },
        { title: 'Practice Sessions', value: '12.6K', note: 'Simulated trades executed' },
      ]}
      faqs={[
        {
          question: 'Who is Learn intended for?',
          answer: 'It supports both beginners and active traders through structured tracks and practical examples.',
        },
        {
          question: 'Are there hands-on exercises?',
          answer: 'Yes. Learning paths include scenario-based tasks and practice trading ideas.',
        },
        {
          question: 'Can I revisit completed modules?',
          answer: 'Absolutely. You can return to previous modules anytime to refresh concepts.',
        },
      ]}
    />
  );
}