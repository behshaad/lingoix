import { Book, FileText, Headphones, Image, Link as LinkIcon, PlaySquare, Type } from "lucide-react";
import { useTranslation } from "react-i18next";

const typeIcons = {
  audio: Headphones,
  book: Book,
  pdf: FileText,
  video: PlaySquare,
  image: Image,
  text: Type,
  link: LinkIcon,
};

const openableAttachmentTypes = new Set(["pdf", "audio", "video", "image", "link"]);

export default function ResourceCard({ resource }) {
  const { t } = useTranslation();
  const Icon = typeIcons[resource.type] || Book;
  const title = t(`resourcesData.${resource.id}.title`, resource.title);
  const description = t(`resourcesData.${resource.id}.description`, resource.description);
  const attachments = resource.attachments || [];

  return (
    <article className="flex min-h-[320px] flex-col rounded-[22px] border border-white/80 bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_64px_rgba(15,23,42,0.12)] dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
          <Icon className="h-6 w-6" />
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {resource.cefrLevel}
        </span>
      </div>

      <div className="mt-5 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
          {t(`resourcePage.types.${resource.type}`, resource.type)}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-950 dark:text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      <div className="mt-5 space-y-2">
        {resource.sourceUrl && (
          <a
            href={resource.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl bg-gray-950 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-gray-950"
          >
            <span>{t("resourcePage.openMain", "Open main resource")}</span>
            <LinkIcon className="h-4 w-4" />
          </a>
        )}

        {attachments.slice(0, 4).map((attachment) => {
          const AttachmentIcon = typeIcons[attachment.type] || LinkIcon;
          const canOpen = openableAttachmentTypes.has(attachment.type);
          const content = (
            <>
              <span className="flex items-center gap-2 truncate">
                <AttachmentIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{attachment.label}</span>
              </span>
              <span className="text-xs uppercase text-gray-400">{attachment.type}</span>
            </>
          );

          if (canOpen) {
            return (
              <a
                key={attachment.id}
                href={attachment.value}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={attachment.id}
              className="rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <div className="mb-1 flex items-center justify-between gap-3">{content}</div>
              <p className="line-clamp-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
                {attachment.value}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
