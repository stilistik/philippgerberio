import clx from "classnames";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea(props: TextAreaProps) {
  const { className, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={clx("border rounded-xl p-3 focus:outline-gray-600", className)}
    />
  );
}
