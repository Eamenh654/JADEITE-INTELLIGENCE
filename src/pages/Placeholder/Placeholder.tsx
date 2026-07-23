import { useLocation } from "react-router";
import { navByPath } from "../../lib/nav";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";

export default function Placeholder() {
  const { pathname } = useLocation();
  const item = navByPath[pathname];
  const title = item?.label ?? "Section";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-paper-raised text-jade-600 shadow-(--shadow-sm)">
        <Icon name={item?.icon ?? "companies"} className="h-7 w-7" strokeWidth={1.6} />
      </span>
      <h2 className="mt-5 font-display text-[1.5rem] font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-[0.9rem] text-ink-soft">
        This workspace is part of the Jadeite Intelligence Hub scope and will be built out
        next. The layout, navigation and design system are ready to host it.
      </p>
      <div className="mt-6 flex gap-2.5">
        <Button variant="ghost" size="md" icon="chevron-right">
          View the roadmap
        </Button>
        <Button variant="primary" size="md" icon="sparkle">
          Ask AI Assistant
        </Button>
      </div>
    </div>
  );
}
