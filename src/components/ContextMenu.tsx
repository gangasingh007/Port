interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

const ContextMenu = ({ x, y, onClose, onAction }: ContextMenuProps) => {
  return (
    <>
      <div className="fixed inset-0 z-[400]" onClick={onClose} />
      <div
        className="fixed z-[401] w-52 mac-menu-glass rounded-lg py-1 animate-fade-in"
        style={{ top: y, left: x }}
      >
        {[
          { label: 'New Finder Window', action: 'finder' },
          { label: '—', action: '' },
          { label: 'About This Portfolio', action: 'about-portfolio' },
          { label: 'Change Wallpaper', action: 'wallpaper' },
        ].map((item, i) =>
          item.label === '—' ? (
            <div key={i} className="h-px bg-foreground/10 mx-3 my-1" />
          ) : (
            <button
              key={i}
              className="w-full text-left px-3 py-1 text-[13px] text-foreground/90 hover:bg-primary hover:text-primary-foreground rounded-[4px] mx-1 mac-transition"
              style={{ width: 'calc(100% - 8px)' }}
              onClick={() => { onAction(item.action); onClose(); }}
            >
              {item.label}
            </button>
          )
        )}
      </div>
    </>
  );
};

export default ContextMenu;
