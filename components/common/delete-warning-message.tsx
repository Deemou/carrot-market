interface DeleteWaringMessageProps {
  type: string;
}

export default function DeleteWaringMessage({
  type
}: DeleteWaringMessageProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Delete {type}?</h3>
      <span className="block opacity-50">This can&apos;t be undone.</span>
    </div>
  );
}
