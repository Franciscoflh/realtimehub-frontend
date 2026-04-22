export function formatTime(dateString?: string | null) {
  if (!dateString) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export function formatRelativeDay(dateString?: string | null) {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDate = (left: Date, right: Date) =>
    left.getDate() === right.getDate() &&
    left.getMonth() === right.getMonth() &&
    left.getFullYear() === right.getFullYear();

  if (sameDate(date, today)) {
    return 'Hoje';
  }

  if (sameDate(date, yesterday)) {
    return 'Ontem';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

export function getChatTitle(chatName: string | undefined, fallbackName: string) {
  return chatName?.trim() || fallbackName;
}
