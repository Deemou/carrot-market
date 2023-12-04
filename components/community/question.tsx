interface QuestionProps {
  question: string;
}

export default function Question({ question }: QuestionProps) {
  return (
    <div className="mt-2">
      <span className="text-orange-500">Q.</span> {question}
    </div>
  );
}
