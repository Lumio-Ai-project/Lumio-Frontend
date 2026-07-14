export function AuthDivider() {
  return (
    <div className="relative my-stack-sm">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-card px-stack-sm text-xs uppercase tracking-wide text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
  );
}
