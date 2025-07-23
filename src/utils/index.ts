import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

export const toastError = (message: string) => {
  return toast.error(message, {
    position: "bottom-right",
  });
};

export const toastSuccess = (message: string) => {
  return toast.success(message, {
    position: "bottom-right",
  });
};

export class BaseHelper {
  static isDueDatePassed(date: string | Date): boolean {
    const dueDate = new Date(date);
    const now = new Date();

    return now > dueDate;
  }

  static isDueSoon(date: string | Date): boolean {
    const dueDate = new Date(date);
    const today = new Date();

    // Normalize time (to avoid partial-day confusion)
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    return daysDiff >= 0 && daysDiff <= 3;
  }

  static getInitials(name: string) {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  static formatDate(date: string | Date) {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return "Just now";
    }

    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  static getDurationInDays(
    startDate: string | Date,
    dueDate: string | Date,
  ): number {
    const start = new Date(startDate).getTime();
    const due = new Date(dueDate).getTime();
    const diffInMs = due - start; // Difference in milliseconds
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24); // Convert ms to days
    return diffInDays;
  }
}
