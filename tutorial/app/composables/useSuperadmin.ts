// ~/composables/useSuperadmin.ts

export interface AdminTeacher {
    _id: string
    firstName: string
    middleName?: string | null
    lastName?: string | null
    email: string
    phone?: string
    avatar?: string | null

    role: "teacher"

    adminOwner?: string

    studentCount: number

    students?: AdminStudent[]
}

export interface AdminStudent {
    _id: string
    firstName: string
    middleName?: string | null
    lastName?: string | null
    email: string
    phone?: string
    avatar?: string | null

    role: "student"

    adminOwner?: string
    teacherOwner?: string | null

    subscriptionStatus?: string | null
}

export interface Admin {
    _id: string

    firstName: string
    middleName?: string | null
    lastName?: string | null

    email: string
    phone?: string

    avatar?: string | null

    role: "admin"

    status: "Active" | "Suspended" | "Inactive"

    createdAt?: string
    updatedAt?: string
    lastLogin?: string | null

    totalTeachers: number
    totalStudents: number
    subscribedStudents: number

    teachers?: AdminTeacher[]

    directStudents?: AdminStudent[]
}

export interface AdminSummary {
    totalAdmins: number
    totalTeachers: number
    totalStudents: number
    subscribedStudents: number
}

export interface SuperadminDashboardResponse {
    summary: AdminSummary
    admins: Admin[]
    pagination?: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export function useSuperadmin() {
    /**
     * GET SUPERADMIN DASHBOARD
     */
    const getDashboard = async () => {
        return await useApiFetch<SuperadminDashboardResponse>(
            "/api/superadmin/dashboard",
            {
                method: "GET",
            }
        )
    }

    /**
     * GET ALL ADMINS
     */
    const getAdmins = async (params?: {
        search?: string
        status?: string
        page?: number
        limit?: number
    }) => {
        const query = new URLSearchParams()

        if (params?.search) {
            query.set("search", params.search)
        }

        if (params?.status && params.status !== "All") {
            query.set("status", params.status)
        }

        if (params?.page) {
            query.set("page", String(params.page))
        }

        if (params?.limit) {
            query.set("limit", String(params.limit))
        }

        const queryString = query.toString()

        return await useApiFetch<SuperadminDashboardResponse>(
            `/api/superadmin/admins${queryString ? `?${queryString}` : ""
            }`,
            {
                method: "GET",
            }
        )
    }

    /**
     * GET ONE ADMIN + ALL TEACHERS + STUDENTS
     */
    const getAdmin = async (adminId: string) => {
        return await useApiFetch<Admin>(
            `/api/superadmin/admins/${adminId}`,
            {
                method: "GET",
            }
        )
    }

    /**
     * GET ADMIN TEACHERS
     */
    const getAdminTeachers = async (adminId: string) => {
        return await useApiFetch<AdminTeacher[]>(
            `/api/superadmin/admins/${adminId}/teachers`,
            {
                method: "GET",
            }
        )
    }

    /**
     * GET ADMIN STUDENTS
     */
    const getAdminStudents = async (adminId: string) => {
        return await useApiFetch<AdminStudent[]>(
            `/api/superadmin/admins/${adminId}/students`,
            {
                method: "GET",
            }
        )
    }

    /**
     * GET TEACHER STUDENTS
     */
    const getTeacherStudents = async (teacherId: string) => {
        return await useApiFetch<AdminStudent[]>(
            `/api/superadmin/teachers/${teacherId}/students`,
            {
                method: "GET",
            }
        )
    }

    /**
     * UPDATE ADMIN
     */
    const updateAdmin = async (
        adminId: string,
        payload: {
            firstName?: string
            middleName?: string | null
            lastName?: string | null
            email?: string
            phone?: string
            avatar?: string | null
        }
    ) => {
        return await useApiFetch<Admin>(
            `/api/superadmin/admins/${adminId}`,
            {
                method: "PUT",
                body: payload,
            }
        )
    }

    /**
     * CHANGE ADMIN STATUS
     */
    const updateAdminStatus = async (
        adminId: string,
        status: "Active" | "Suspended" | "Inactive"
    ) => {
        return await useApiFetch<Admin>(
            `/api/superadmin/admins/${adminId}/status`,
            {
                method: "PATCH",
                body: {
                    status,
                },
            }
        )
    }

    /**
     * DELETE ADMIN
     */
    const deleteAdmin = async (adminId: string) => {
        return await useApiFetch(
            `/api/superadmin/admins/${adminId}`,
            {
                method: "DELETE",
            }
        )
    }

    return {
        getDashboard,
        getAdmins,
        getAdmin,
        getAdminTeachers,
        getAdminStudents,
        getTeacherStudents,
        updateAdmin,
        updateAdminStatus,
        deleteAdmin,
    }
}