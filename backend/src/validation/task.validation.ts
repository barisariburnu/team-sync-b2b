import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";

export const titleSchema = z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" });

export const descriptionSchema = z
    .string()
    .trim()
    .optional();

export const assignedToSchema = z
    .string()
    .trim()
    .min(1, { message: "Assigned to is required" })
    .nullable()
    .optional();

export const prioritySchema = z.enum(
  Object.values(TaskPriorityEnum) as [string, ...string[]],
  { message: "Invalid priority" }
);

export const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]],
  { message: "Invalid status" }
);

export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      return !val || !isNaN(Date.parse(val));
    },
    {
      message: "Invalid date format. Please provide a valid date string.",
    }
  );

export const taskIdSchema = z.string()
    .trim()
    .min(1, { message: "Task ID is required" });

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});