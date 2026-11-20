export type UserRole = "student" | "teacher" | "admin" | "superadmin";

export type NavRole = UserRole | "all";

export interface NavItem {
  label: string;
  icon: string;
  to: string;
  roles: NavRole[];
}