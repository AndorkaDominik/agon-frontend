import { Avatar, Badge } from "@radix-ui/themes";

type AnimalAvatarWithBadgeProps = {
  src: string;
  fallback: string;
  className?: string;
  badgeClassName?: string;
  badgeText: string;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export default function AnimalAvatarWithBadge({
  src,
  fallback,
  className,
  badgeClassName,
  badgeText,
  radius = 'full',
}: AnimalAvatarWithBadgeProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={src}
        fallback={fallback}
        radius={radius}
        className={className}
      />
      <Badge
        className={badgeClassName}
        radius="full"
        size="3"
        style={{
          position: 'absolute',
          bottom: '-1rem',
          left: '50%', 
          transform: 'translateX(-50%)', whiteSpace: 'nowrap'
        }}
      >
        {badgeText}
      </Badge>
    </div>
  );
}
