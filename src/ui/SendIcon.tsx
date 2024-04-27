function SendIcon(props: any) {
  return (
    <svg
      fill="none"
      stroke="#22c55e"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      className="w-8 h-8 lg:w-10 lg:h-10 select-none cursor-pointer active:scale-95 duration-300 hover:opacity-70"
      {...props}
    >
      <path d="M22 2l-7 20-4-9-9-4zM22 2L11 13" />
    </svg>
  );
}

export default SendIcon;
