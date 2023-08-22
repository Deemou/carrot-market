interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <span className="my-2 block text-center text-red-600">{message}</span>;
}

ErrorMessage.defaultProps = {
  message: ''
};
