"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Home,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Plus,
  Download,
  UserCheck,
  User,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Eye,
  Moon,
  Sun,
  Mail,
  MicOff as MailOff,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type TeacherPage = "home" | "classes" | "content" | "analytics" | "support" | "student-profile" | "assignment-submissions" | "quiz-results" | "reports" | "settings" | "create-assignment" | "grade-assignment" | "performance-analytics" | "class-details" | "lesson-planner" | "resource-library" | "parent-communication" | "attendance-tracker" | "curriculum-standards" | "assessment-tools" | "class-management" | "student-management" | "assignment-management" | "content-management" | "help-faq" | "technical-support" | "teaching-resources" | "notifications" | "detailed-analytics"

interface StudentProfile {
  id: string
  name: string
  grade: string
  xp: number
  attendance: number
  performance: number
  status: "active" | "attention"
  lastLogin?: string
  weeklyLogins?: number
  recentQuizScore?: number
  classRank?: number
}

interface Assignment {
  id: string
  title: string
  class: string
  due: string
  submissions: StudentSubmission[]
  total: number
  status: "active" | "completed"
  createdAt: Date
}

interface StudentSubmission {
  studentId: string
  studentName: string
  submittedAt: string
  status: "submitted" | "pending"
  score?: number
}

interface Quiz {
  id: string
  title: string
  class: string
  questions: number
  difficulty: string
  status: "active" | "completed"
  createdAt: Date
  results: QuizResult[]
}

interface QuizResult {
  studentId: string
  studentName: string
  score: number
  completedAt: string
}

interface Lesson {
  id: string
  title: string
  description: string
  category: string
  contentTypes: LessonContent[]
  createdAt: Date
}

interface LessonContent {
  type: "video" | "notes" | "cheatsheet" | "file"
  title: string
  content: string
  url?: string
}

export function TeacherDashboard() {
  const { user, signOut } = useAuth()
  const [currentPage, setCurrentPage] = useState<TeacherPage>("home")
  const [selectedClass, setSelectedClass] = useState("math-10")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "xp">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [attendance, setAttendance] = useState<Record<string, "p" | "a">>({})
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState("english")
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [selectedClassForDetails, setSelectedClassForDetails] = useState<string | null>(null)
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<string>("all")
  const [selectedCurriculumStandard, setSelectedCurriculumStandard] = useState<string | null>(null)

  // Teaching Resources Data
  const teachingResources = [
    { title: "NCERT Grade 3 Mathematics", url: "https://ncert.nic.in/textbook/pdf/cemh1dd.pdf", description: "Complete mathematics curriculum for grade 3 students" },
    { title: "NCERT Grade 4 Science", url: "https://ncert.nic.in/textbook/pdf/dees1dd.pdf", description: "Science fundamentals and experiments for grade 4" },
    { title: "NCERT Grade 5 English", url: "https://ncert.nic.in/textbook/pdf/eemh1dd.pdf", description: "English language learning materials for grade 5" },
    { title: "NCERT Grade 6 Social Science", url: "https://ncert.nic.in/textbook/pdf/fess1dd.pdf", description: "History, geography and civics for grade 6" },
    { title: "NCERT Grade 7 Mathematics", url: "https://ncert.nic.in/textbook/pdf/gemh1dd.pdf", description: "Advanced mathematics concepts for grade 7" },
    { title: "NCERT Grade 8 Science", url: "https://ncert.nic.in/textbook/pdf/hess1dd.pdf", description: "Physics, chemistry and biology for grade 8" },
    { title: "NCERT Grade 9 Mathematics", url: "https://ncert.nic.in/textbook/pdf/iemh1dd.pdf", description: "High school mathematics curriculum" },
    { title: "NCERT Grade 10 Science", url: "https://ncert.nic.in/textbook/pdf/jess1dd.pdf", description: "Board exam preparation materials for science" },
  ]

  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    files: [] as File[],
  })
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    questions: [] as Array<{
      question: string
      options: string[]
      correctAnswer: number
    }>,
  })

  const [allStudents] = useState<StudentProfile[]>([
    {
      id: "STU001",
      name: "Rahul Kumar",
      grade: "10",
      xp: 1250,
      attendance: 95,
      performance: 88,
      status: "active",
      lastLogin: "2024-12-15",
      weeklyLogins: 6,
      recentQuizScore: 85,
      classRank: 3,
    },
    {
      id: "STU002",
      name: "Priya Singh",
      grade: "11",
      xp: 1180,
      attendance: 98,
      performance: 92,
      status: "active",
      lastLogin: "2024-12-15",
      weeklyLogins: 7,
      recentQuizScore: 92,
      classRank: 1,
    },
    {
      id: "STU003",
      name: "Ankit Sharma",
      grade: "10",
      xp: 980,
      attendance: 85,
      performance: 78,
      status: "attention",
      lastLogin: "2024-12-14",
      weeklyLogins: 4,
      recentQuizScore: 72,
      classRank: 5,
    },
    {
      id: "STU004",
      name: "Neha Patel",
      grade: "10",
      xp: 1350,
      attendance: 100,
      performance: 95,
      status: "active",
      lastLogin: "2024-12-15",
      weeklyLogins: 7,
      recentQuizScore: 96,
      classRank: 1,
    },
    {
      id: "STU005",
      name: "Ravi Gupta",
      grade: "9",
      xp: 890,
      attendance: 92,
      performance: 82,
      status: "active",
      lastLogin: "2024-12-15",
      weeklyLogins: 5,
      recentQuizScore: 78,
      classRank: 2,
    },
    {
      id: "STU006",
      name: "Sita Devi",
      grade: "11",
      xp: 1420,
      attendance: 96,
      performance: 90,
      status: "active",
      lastLogin: "2024-12-15",
      weeklyLogins: 6,
      recentQuizScore: 88,
      classRank: 2,
    },
  ])

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Algebra Problem Set 5",
      class: "Mathematics - Grade 10",
      due: "Dec 15, 2024",
      submissions: [
        {
          studentId: "STU001",
          studentName: "Rahul Kumar",
          submittedAt: "Dec 12, 2024",
          status: "submitted",
          score: 85,
        },
        { studentId: "STU004", studentName: "Neha Patel", submittedAt: "Dec 13, 2024", status: "submitted", score: 96 },
      ],
      total: 32,
      status: "active",
      createdAt: new Date(),
    },
  ])

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Algebra Quick Quiz",
      class: "Mathematics - Grade 10",
      questions: 10,
      difficulty: "Easy",
      status: "active",
      createdAt: new Date(),
      results: [
        { studentId: "STU001", studentName: "Rahul Kumar", score: 85, completedAt: "Dec 10, 2024" },
        { studentId: "STU003", studentName: "Ankit Sharma", score: 72, completedAt: "Dec 11, 2024" },
        { studentId: "STU004", studentName: "Neha Patel", score: 96, completedAt: "Dec 10, 2024" },
      ],
    },
  ])

  const [lessons, setLessons] = useState<Lesson[]>([])

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "classes", label: "Class Management", icon: Users },
    { id: "content", label: "Content & Assignments", icon: BookOpen },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "support", label: "Support & Settings", icon: Settings },
  ]

  const classes = [
    { id: "math-10", name: "Mathematics - Grade 10", students: 32, subject: "Mathematics", grade: "10" },
    { id: "science-10", name: "Science - Grade 10", students: 32, subject: "Science", grade: "10" },
    { id: "social-10", name: "Social Science - Grade 10", students: 32, subject: "Social Science", grade: "10" },
    { id: "computer-10", name: "Computer - Grade 10", students: 32, subject: "Computer", grade: "10" },
    { id: "english-10", name: "English - Grade 10", students: 32, subject: "English", grade: "10" },
    { id: "math-9", name: "Mathematics - Grade 9", students: 35, subject: "Mathematics", grade: "9" },
    { id: "science-9", name: "Science - Grade 9", students: 35, subject: "Science", grade: "9" },
    { id: "math-8", name: "Mathematics - Grade 8", students: 30, subject: "Mathematics", grade: "8" },
    { id: "english-8", name: "English - Grade 8", students: 30, subject: "English", grade: "8" },
  ]

  const getStudentsForClass = () => {
    const selectedClassData = classes.find((c) => c.id === selectedClass)
    if (!selectedClassData) return []
    return allStudents.filter((student) => student.grade === selectedClassData.grade)
  }

  const getClassStats = () => {
    const classStudents = getStudentsForClass()
    const totalStudents = classStudents.length

    // Calculate pending reviews based on students who haven't submitted assignments
    const pendingReviews = assignments.reduce((sum, assignment) => {
      const submittedStudentIds = assignment.submissions.map((s) => s.studentId)
      const pendingCount = classStudents.filter((student) => !submittedStudentIds.includes(student.id)).length
      return sum + pendingCount
    }, 0)

    const avgPerformance =
      classStudents.length > 0
        ? Math.round(classStudents.reduce((sum, student) => sum + student.xp / 15, 0) / classStudents.length)
        : 0

    return { totalStudents, pendingReviews, avgPerformance }
  }

  const handleCreateAssignment = () => {
    if (assignmentForm.title && assignmentForm.description && assignmentForm.dueDate) {
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        title: assignmentForm.title,
        class: classes.find((c) => c.id === selectedClass)?.name || "",
        due: assignmentForm.dueDate,
        submissions: [],
        total: getStudentsForClass().length,
        status: "active",
        createdAt: new Date(),
      }
      setAssignments((prev) => [...prev, newAssignment])
      setAssignmentForm({ title: "", description: "", dueDate: "", files: [] })
      setShowAssignmentForm(false)
      alert("Assignment created successfully!")
    }
  }

  const handleCreateQuiz = () => {
    if (quizForm.title && quizForm.description && quizForm.questions.length > 0) {
      const newQuiz: Quiz = {
        id: Date.now().toString(),
        title: quizForm.title,
        class: classes.find((c) => c.id === selectedClass)?.name || "",
        questions: quizForm.questions.length,
        difficulty: "Medium",
        status: "active",
        createdAt: new Date(),
        results: [],
      }
      setQuizzes((prev) => [...prev, newQuiz])
      setQuizForm({ title: "", description: "", questions: [] })
      setShowQuizForm(false)
      alert("Quiz created successfully!")
    }
  }

  const addQuizQuestion = () => {
    const question = prompt("Enter question:")
    if (question) {
      const options = []
      for (let i = 0; i < 4; i++) {
        const option = prompt(`Enter option ${String.fromCharCode(65 + i)}:`)
        if (option) options.push(option)
      }
      if (options.length === 4) {
        const correctAnswer = Number.parseInt(prompt("Enter correct answer (0-3):") || "0")
        setQuizForm((prev) => ({
          ...prev,
          questions: [...prev.questions, { question, options, correctAnswer }],
        }))
      }
    }
  }

  const getPerformanceHistogramData = () => {
    const classStudents = getStudentsForClass()
    const ranges = [
      { range: "0-20", min: 0, max: 20, count: 0 },
      { range: "21-40", min: 21, max: 40, count: 0 },
      { range: "41-60", min: 41, max: 60, count: 0 },
      { range: "61-80", min: 61, max: 80, count: 0 },
      { range: "81-100", min: 81, max: 100, count: 0 },
    ]

    classStudents.forEach((student) => {
      const performance = Math.round(student.xp / 15)
      const range = ranges.find((r) => performance >= r.min && performance <= r.max)
      if (range) range.count++
    })

    return ranges
  }

  const getAverageStudyTime = () => {
    const classStudents = getStudentsForClass()
    return classStudents.length > 0
      ? Math.round(
          (classStudents.reduce((sum, student) => sum + (student.weeklyLogins || 0) * 0.5, 0) / classStudents.length) *
            10,
        ) / 10
      : 0
  }

  const getCompletionRate = () => {
    const classStudents = getStudentsForClass()
    const targetXP = 1000 // Define target XP
    const completedStudents = classStudents.filter((student) => student.xp >= targetXP).length
    return classStudents.length > 0 ? Math.round((completedStudents / classStudents.length) * 100) : 0
  }

  const getSortedAndFilteredStudents = () => {
    let students = getStudentsForClass()

    if (searchTerm) {
      students = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    students.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else {
        return sortOrder === "asc" ? a.xp - b.xp : b.xp - a.xp
      }
    })

    return students
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "classes":
        return <ClassManagementPage />
      case "content":
        return <ContentManagementPage />
      case "analytics":
        return <AnalyticsPage />
      case "support":
        return <SupportPage />
      case "student-management":
        return <StudentManagementPage />
      case "assignment-management":
        return <AssignmentManagementPage />
      case "performance-analytics":
        return <PerformanceAnalyticsPage />
      case "class-details":
        return <ClassDetailsPage />
      case "lesson-planner":
        return <LessonPlannerPage />
      case "resource-library":
        return <ResourceLibraryPage />
      case "parent-communication":
        return <ParentCommunicationPage />
      case "attendance-tracker":
        return <AttendanceTrackerPage />
      case "curriculum-standards":
        return <CurriculumStandardsPage />
      case "assessment-tools":
        return <AssessmentToolsPage />
      case "create-assignment":
        return <CreateAssignmentPage />
      case "grade-assignment":
        return <GradeAssignmentPage />
      case "student-profile":
        return <StudentProfilePage />
      case "assignment-submissions":
        return <AssignmentSubmissionsPage />
      case "quiz-results":
        return <QuizResultsPage />
      case "reports":
        return <ReportsPage />
      case "settings":
        return <SettingsPage />
      case "help-faq":
        return <HelpFAQPage />
      case "technical-support":
        return <TechnicalSupportPage />
      case "teaching-resources":
        return <TeachingResourcesPage />
      case "notifications":
        return <NotificationsPage />
      case "detailed-analytics":
        return <DetailedAnalyticsPage />
      default:
        return <HomePage />
    }
  }

  const HomePage = () => {
    const stats = getClassStats()
    const classStudents = getStudentsForClass()
    const topPerformers = classStudents.sort((a, b) => b.xp - a.xp).slice(0, 3)

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
          <p className="text-muted-foreground">Here's what's happening in your classes today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            onClick={() => {
              setCurrentPage("student-management")
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-xl font-bold">{stats.totalStudents}</p>
                  <p className="text-xs text-green-600">In selected class</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-white to-green-50 border-green-200"
            onClick={() => {
              setCurrentPage("assignment-management")
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-xl font-bold">{stats.pendingReviews}</p>
                  <p className="text-xs text-red-600">Assignment reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-green-100 border-green-200"
            onClick={() => {
              setCurrentPage("performance-analytics")
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-chart-3/10 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Performance</p>
                  <p className="text-xl font-bold">{stats.avgPerformance}%</p>
                  <p className="text-xs text-green-600">Based on XP points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => setCurrentPage("content")} className="h-16 flex-col">
                  <Plus className="h-5 w-5 mb-2" />
                  Create Assignment
                </Button>
                <Button onClick={() => setCurrentPage("classes")} variant="outline" className="h-16 flex-col">
                  <UserCheck className="h-5 w-5 mb-2" />
                  Take Attendance
                </Button>
                <Button onClick={() => setCurrentPage("analytics")} variant="outline" className="h-16 flex-col">
                  <BarChart3 className="h-5 w-5 mb-2" />
                  View Reports
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments
                  .flatMap((assignment) =>
                    assignment.submissions.map((submission) => ({
                      type: "submission",
                      message: `Assignment submitted by ${submission.studentName}`,
                      class: assignment.class,
                      time: submission.submittedAt,
                    })),
                  )
                  .slice(0, 3)
                  .map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 rounded-full mt-2 bg-primary"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.class} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performance This Week</CardTitle>
                <CardDescription>Students with highest XP points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPerformers.map((student, index) => (
                  <div key={student.id} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.xp} XP</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const ClassManagementPage = () => {
    const classStudents = getSortedAndFilteredStudents()

    const handleSaveAttendance = () => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Name,ID,Date,Status\n" +
        classStudents
          .map(
            (student) =>
              `${student.name},${student.id},${new Date().toLocaleDateString()},${attendance[student.id] || "Not Marked"}`,
          )
          .join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `attendance_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      alert("Attendance saved successfully!")
    }

    const handleAddStudent = () => {
      const searchQuery = prompt("Enter student name to search:")
      if (searchQuery) {
        const foundStudents = allStudents.filter(
          (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !getStudentsForClass().some((classStudent) => classStudent.id === student.id),
        )

        if (foundStudents.length > 0) {
          alert(
            `Found students:\n${foundStudents.map((s) => `${s.name} (Grade ${s.grade})`).join("\n")}\n\nNote: Only students matching the selected class grade will be added.`,
          )
        } else {
          alert("No matching students found.")
        }
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Class & Student Management</h2>
            <p className="text-muted-foreground">Manage your classes, students, and attendance</p>
          </div>
          <Button onClick={handleAddStudent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>
                {classes.find((c) => c.id === selectedClass)?.name} - {classStudents.length} students
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveAttendance}>
                <Download className="h-4 w-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search students..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split("-")
                  setSortBy(field as "name" | "xp")
                  setSortOrder(order as "asc" | "desc")
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="xp-asc">XP (Low to High)</SelectItem>
                  <SelectItem value="xp-desc">XP (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {classStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{student.xp} XP</p>
                      <p className="text-xs text-muted-foreground">Total Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{Math.round(student.xp / 15)}%</p>
                      <p className="text-xs text-muted-foreground">Performance</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "p" ? "default" : "outline"}
                        onClick={() => setAttendance((prev) => ({ ...prev, [student.id]: "p" }))}
                      >
                        P
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "a" ? "destructive" : "outline"}
                        onClick={() => setAttendance((prev) => ({ ...prev, [student.id]: "a" }))}
                      >
                        A
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student)
                        setCurrentPage("student-profile")
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ContentManagementPage = () => {
    const [showLessonForm, setShowLessonForm] = useState(false)
    const [lessonForm, setLessonForm] = useState({
      title: "",
      description: "",
      category: "",
      contentTypes: [] as LessonContent[],
    })

    const handleCreateLesson = () => {
      if (lessonForm.title && lessonForm.description) {
        const newLesson: Lesson = {
          id: Date.now().toString(),
          title: lessonForm.title,
          description: lessonForm.description,
          category: lessonForm.category,
          contentTypes: lessonForm.contentTypes,
          createdAt: new Date(),
        }
        setLessons((prev) => [...prev, newLesson])
        setLessonForm({ title: "", description: "", category: "", contentTypes: [] })
        setShowLessonForm(false)
        // Lesson created successfully - could add a toast notification here
      }
    }

    const addContentToLesson = (type: "video" | "notes" | "cheatsheet" | "file") => {
      const title = prompt(`Enter ${type} title:`)
      const content = prompt(`Enter ${type} content/URL:`)

      if (title && content) {
        setLessonForm((prev) => ({
          ...prev,
          contentTypes: [...prev.contentTypes, { type, title, content }],
        }))
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Content & Assignment Management</h2>
            <p className="text-muted-foreground">Create and manage learning materials and assignments</p>
          </div>
        </div>

        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Assignments</CardTitle>
                  <CardDescription>Manage your class assignments</CardDescription>
                </div>
                <Dialog open={showAssignmentForm} onOpenChange={setShowAssignmentForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Assignment</DialogTitle>
                      <DialogDescription>Fill in the assignment details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Assignment Title</Label>
                        <Input
                          value={assignmentForm.title}
                          onChange={(e) => setAssignmentForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter assignment title"
                        />
                      </div>
                      <div>
                        <Label>Description / Instructions</Label>
                        <Textarea
                          value={assignmentForm.description}
                          onChange={(e) => setAssignmentForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Assignment instructions"
                        />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={assignmentForm.dueDate}
                          onChange={(e) => setAssignmentForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>File Upload</Label>
                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.docx,.doc,.jpg,.png"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            setAssignmentForm((prev) => ({ ...prev, files }))
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateAssignment}>Create Assignment</Button>
                        <Button variant="outline" onClick={() => setShowAssignmentForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">{assignment.class}</p>
                      <p className="text-xs text-muted-foreground">Due: {assignment.due}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {assignment.submissions.length}/{assignment.total}
                        </p>
                        <p className="text-xs text-muted-foreground">Submissions</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const submissionList =
                            assignment.submissions.length > 0
                              ? assignment.submissions
                                  .map((s) => `${s.studentName} - ${s.status} (${s.submittedAt})`)
                                  .join("\n")
                              : "No submissions yet"
                          alert(`Submissions for ${assignment.title}:\n\n${submissionList}`)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Submissions
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Quizzes</CardTitle>
                  <CardDescription>Manage your class quizzes</CardDescription>
                </div>
                <Dialog open={showQuizForm} onOpenChange={setShowQuizForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Quiz</DialogTitle>
                      <DialogDescription>Fill in the quiz details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Quiz Title</Label>
                        <Input
                          value={quizForm.title}
                          onChange={(e) => setQuizForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter quiz title"
                        />
                      </div>
                      <div>
                        <Label>Description / Instructions</Label>
                        <Textarea
                          value={quizForm.description}
                          onChange={(e) => setQuizForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Quiz instructions"
                        />
                      </div>
                      <div>
                        <Label>Questions ({quizForm.questions.length})</Label>
                        <Button size="sm" variant="outline" onClick={addQuizQuestion}>
                          Add MCQ Question
                        </Button>
                        {quizForm.questions.map((q, index) => (
                          <div key={index} className="p-2 bg-muted rounded text-sm">
                            Q{index + 1}: {q.question}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateQuiz}>Create Quiz</Button>
                        <Button variant="outline" onClick={() => setShowQuizForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{quiz.title}</h4>
                      <p className="text-sm text-muted-foreground">{quiz.class}</p>
                      <p className="text-xs text-muted-foreground">
                        {quiz.questions} questions • {quiz.difficulty}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{quiz.results.length}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const resultsList =
                            quiz.results.length > 0
                              ? quiz.results
                                  .map((r) => `${r.studentName}: ${r.score} points (${r.completedAt})`)
                                  .join("\n")
                              : "No results yet"
                          alert(`Results for ${quiz.title}:\n\n${resultsList}`)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lessons Library</CardTitle>
                  <CardDescription>Create and manage lesson content</CardDescription>
                </div>
                <Button onClick={() => setShowLessonForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Lesson
                </Button>
              </CardHeader>
              <CardContent>
                {showLessonForm && (
                  <div className="border rounded-lg p-4 mb-4 space-y-4">
                    <h3 className="font-medium">Create New Lesson</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Lesson Title</Label>
                        <Input
                          value={lessonForm.title}
                          onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter lesson title"
                        />
                      </div>
                      <div>
                        <Label>Category/Subject</Label>
                        <Select
                          value={lessonForm.category}
                          onValueChange={(value) => setLessonForm((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="social">Social Science</SelectItem>
                            <SelectItem value="computer">Computer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={lessonForm.description}
                        onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Lesson description"
                      />
                    </div>

                    <div>
                      <Label>Content Types</Label>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => addContentToLesson("video")}>
                          Add Video
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addContentToLesson("notes")}>
                          Add Notes
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addContentToLesson("cheatsheet")}>
                          Add Cheat Sheet
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addContentToLesson("file")}>
                          Add File
                        </Button>
                      </div>

                      {lessonForm.contentTypes.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {lessonForm.contentTypes.map((content, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">
                                {content.type}: {content.title}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setLessonForm((prev) => ({
                                    ...prev,
                                    contentTypes: prev.contentTypes.filter((_, i) => i !== index),
                                  }))
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleCreateLesson}>Create Lesson</Button>
                      <Button variant="outline" onClick={() => setShowLessonForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{lesson.title}</h4>
                        <Badge variant="secondary">{lesson.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {lesson.contentTypes.map((content, index) => (
                          <Badge key={index} variant="outline">
                            {content.type}: {content.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}

                  {lessons.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No lessons created yet. Click "Create Lesson" to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  const AnalyticsPage = () => {
    const classStudents = getStudentsForClass()
    const histogramData = getPerformanceHistogramData()
    const avgStudyTime = getAverageStudyTime()
    const completionRate = getCompletionRate()

    const avgClassScore =
      classStudents.length > 0
        ? Math.round(
            classStudents.reduce((sum, student) => sum + (student.recentQuizScore || 0), 0) / classStudents.length,
          )
        : 0

    const engagementRate =
      classStudents.length > 0
        ? Math.round(
            (classStudents.filter((student) => (student.weeklyLogins || 0) >= 5).length / classStudents.length) * 100,
          )
        : 0

    const subjectPerformance = [
      { subject: "Mathematics", average: avgClassScore, students: classStudents.length },
      { subject: "Science", average: avgClassScore - 5, students: classStudents.length },
      { subject: "English", average: avgClassScore + 3, students: classStudents.length },
      { subject: "Social Science", average: avgClassScore - 2, students: classStudents.length },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
          <p className="text-muted-foreground">Comprehensive insights into class and student performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            onClick={() => {
              setCurrentPage("quiz-results")
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Class Score</p>
                  <p className="text-xl font-bold">{avgClassScore}%</p>
                  <p className="text-xs text-green-600">Recent quiz average</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-white to-green-50 border-green-200"
            onClick={() => {
              setCurrentPage("detailed-analytics")
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <p className="text-xl font-bold">{engagementRate}%</p>
                  <p className="text-xs text-green-600">Daily portal users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              const studyTimeData = classStudents
                .map((s) => `${s.name}: ${((s.weeklyLogins || 0) * 0.5).toFixed(1)} hours/week`)
                .join("\n")
              alert(`Average Study Time (Portal Usage):\n\n${studyTimeData}`)
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Study Time</p>
                  <p className="text-xl font-bold">{avgStudyTime}h</p>
                  <p className="text-xs text-muted-foreground">Portal usage/week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-green-100 border-green-200"
            onClick={() => {
              setCurrentPage("performance-analytics")
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-chart-3/10 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-xl font-bold">{completionRate}%</p>
                  <p className="text-xs text-green-600">Target achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance Trend</CardTitle>
              <CardDescription>Performance distribution by score ranges (past month)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium">{avgClassScore}%</p>
                  <p className="text-muted-foreground">Average Score</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{Math.max(...classStudents.map((s) => Math.round(s.xp / 15)))}%</p>
                  <p className="text-muted-foreground">Highest Score</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{Math.min(...classStudents.map((s) => Math.round(s.xp / 15)))}%</p>
                  <p className="text-muted-foreground">Lowest Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Progress Distribution</CardTitle>
              <CardDescription>Average performance across subjects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectPerformance.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{subject.subject}</span>
                    <span>{subject.average}% avg</span>
                  </div>
                  <Progress value={subject.average} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Detailed Student Analysis</CardTitle>
              <CardDescription>Individual student performance breakdown</CardDescription>
            </div>
            <Button
              onClick={() => {
                const csvContent =
                  "data:text/csv;charset=utf-8," +
                  "Name,XP Points,Recent Quiz Score,Class Rank,Performance\n" +
                  classStudents
                    .map(
                      (student) =>
                        `${student.name},${student.xp},${student.recentQuizScore || 0},${student.classRank || "N/A"},${Math.round(student.xp / 15)}%`,
                    )
                    .join("\n")

                const encodedUri = encodeURI(csvContent)
                const link = document.createElement("a")
                link.setAttribute("href", encodedUri)
                link.setAttribute("download", "student_analysis_report.csv")
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                alert("Report exported successfully!")
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {student.xp} XP • Performance: {Math.round(student.xp / 15)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{student.recentQuizScore || 0}</p>
                      <p className="text-xs text-muted-foreground">Recent Quiz</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">#{student.classRank || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">Class Rank</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert(
                          `Detailed Analysis for ${student.name}:\n\nTotal XP: ${student.xp}\nRecent Quiz Score: ${student.recentQuizScore || 0}\nClass Rank: #${student.classRank || "N/A"}\nOverall Performance: ${Math.round(student.xp / 15)}%`,
                        )
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const SupportPage = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Support & Settings</h2>
          <p className="text-muted-foreground">Customize your dashboard and get help when needed</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>Personalize your teaching experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDarkMode(!darkMode)
                    document.documentElement.classList.toggle("dark")
                    alert(`Dark mode ${!darkMode ? "enabled" : "disabled"}`)
                  }}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified about student activities</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmailNotifications(!emailNotifications)
                    alert(`Email notifications ${!emailNotifications ? "enabled" : "disabled"}`)
                  }}
                >
                  {emailNotifications ? <Mail className="h-4 w-4" /> : <MailOff className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                </div>
                <Select
                  value={language}
                  onValueChange={(value) => {
                    setLanguage(value)
                    alert(
                      `Language changed to ${value === "english" ? "English" : value === "hindi" ? "Hindi" : "Odia"}. Portal language updated.`,
                    )
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिंदी</SelectItem>
                    <SelectItem value="odia">ଓଡ଼ିଆ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Support</CardTitle>
              <CardDescription>Need help? We're here to assist you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => {
                  setCurrentPage("help-faq")
                }}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & FAQ
              </Button>

              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => {
                  setCurrentPage("technical-support")
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Technical Support
              </Button>

              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => {
                  setCurrentPage("teaching-resources")
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Teaching Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // New Page Components with Indian Flag Colors
  const StudentManagementPage = () => {
    const classStudents = getStudentsForClass()
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 to-white p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Student Management</h2>
          <p className="text-orange-600">Manage students in {classes.find((c) => c.id === selectedClass)?.name}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow bg-gradient-to-br from-white to-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">{student.name}</h3>
                    <p className="text-sm text-green-600">Grade {student.grade}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">XP Points</span>
                    <span className="text-sm font-medium text-orange-600">{student.xp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Attendance</span>
                    <span className="text-sm font-medium text-green-600">{student.attendance}%</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                    onClick={() => {
                      setSelectedStudent(student)
                      setCurrentPage("student-profile")
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const AssignmentManagementPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-white to-green-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Assignment Management</h2>
          <p className="text-green-600">Review and manage assignments for your students</p>
        </div>
        
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white border-orange-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">{assignment.title}</h3>
                    <p className="text-sm text-green-600 mb-2">{assignment.description}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span>Submissions: {assignment.submissions.length}/{assignment.total}</span>
                    </div>
                  </div>
                  <Badge variant={assignment.status === "active" ? "default" : "secondary"} className="bg-orange-100 text-orange-800">
                    {assignment.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      setSelectedAssignment(assignment)
                      setCurrentPage("assignment-submissions")
                    }}
                  >
                    View Submissions
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
                    onClick={() => {
                      setSelectedAssignment(assignment)
                      setCurrentPage("grade-assignment")
                    }}
                  >
                    Grade Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const PerformanceAnalyticsPage = () => {
    const classStudents = getStudentsForClass()
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Performance Analytics</h2>
          <p className="text-orange-600">Detailed performance analysis for your students</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {Math.round(classStudents.reduce((acc, s) => acc + s.xp, 0) / classStudents.length)}
                </div>
                <p className="text-sm text-orange-800">Average XP</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-white border-gray-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {Math.round(classStudents.reduce((acc, s) => acc + s.attendance, 0) / classStudents.length)}%
                </div>
                <p className="text-sm text-gray-800">Average Attendance</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {classStudents.filter(s => s.xp > 500).length}
                </div>
                <p className="text-sm text-green-800">High Performers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-orange-50 via-white to-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Student Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{student.name}</p>
                      <p className="text-sm text-orange-600">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{student.xp} XP</p>
                    <p className="text-sm text-green-600">{student.attendance}% attendance</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ClassDetailsPage = () => {
    const selectedClassData = classes.find(c => c.id === selectedClass)
    const classStudents = getStudentsForClass()
    
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 via-white to-green-100 p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Class Details</h2>
          <p className="text-green-600">{selectedClassData?.name} - Comprehensive Overview</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Class Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class Name</span>
                <span className="font-medium text-orange-600">{selectedClassData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Students</span>
                <span className="font-medium text-green-600">{classStudents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Assignments</span>
                <span className="font-medium text-orange-600">{assignments.filter(a => a.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed Assignments</span>
                <span className="font-medium text-green-600">{assignments.filter(a => a.status === 'completed').length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                  <div className="bg-orange-100 p-1 rounded-full">
                    <BookOpen className="h-3 w-3 text-orange-600" />
                  </div>
                  <span className="text-sm text-orange-700">New assignment created</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Users className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm text-green-700">5 submissions received</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                  <div className="bg-orange-100 p-1 rounded-full">
                    <CheckCircle className="h-3 w-3 text-orange-600" />
                  </div>
                  <span className="text-sm text-orange-700">3 assignments graded</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const LessonPlannerPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Lesson Planner</h2>
          <p className="text-orange-600">Plan and organize your lessons effectively</p>
        </div>
        
        <div className="grid gap-6">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Create New Lesson Plan</CardTitle>
              <CardDescription className="text-orange-600">Design comprehensive lesson plans for your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-green-800">Lesson Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter lesson title"
                    className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-green-800">Subject</label>
                  <select className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Social Studies</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-green-800">Learning Objectives</label>
                <textarea 
                  placeholder="Define what students will learn..."
                  rows={3}
                  className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                Create Lesson Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Recent Lesson Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <BookOpen className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Algebra Basics - Lesson {i}</p>
                        <p className="text-sm text-orange-600">Mathematics • Created 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-green-300 text-green-600 hover:bg-green-50">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const ResourceLibraryPage = () => {
    const resourceCategories = [
      { id: 'videos', name: 'Educational Videos', count: 45, color: 'orange' },
      { id: 'worksheets', name: 'Worksheets', count: 32, color: 'green' },
      { id: 'presentations', name: 'Presentations', count: 28, color: 'orange' },
      { id: 'assessments', name: 'Assessments', count: 19, color: 'green' }
    ]

    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 via-white to-green-100 p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Resource Library</h2>
          <p className="text-green-600">Access and manage your teaching resources</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {resourceCategories.map((category) => (
            <Card 
              key={category.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br ${
                category.color === 'orange' 
                  ? 'from-orange-50 to-orange-100 border-orange-200' 
                  : 'from-green-50 to-green-100 border-green-200'
              }`}
              onClick={() => setSelectedResourceCategory(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`bg-${category.color === 'orange' ? 'orange' : 'green'}-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center`}>
                  <BookOpen className={`h-6 w-6 text-${category.color === 'orange' ? 'orange' : 'green'}-600`} />
                </div>
                <h3 className={`font-semibold text-${category.color === 'orange' ? 'orange' : 'green'}-800`}>
                  {category.name}
                </h3>
                <p className={`text-sm text-${category.color === 'orange' ? 'orange' : 'green'}-600 mt-1`}>
                  {category.count} resources
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Featured Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Video className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Introduction to Fractions - Part {i}</p>
                      <p className="text-sm text-orange-600">Mathematics • 15 minutes • HD Quality</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-green-300 text-green-600 hover:bg-green-50"
                  >
                    Preview
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ParentCommunicationPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Parent Communication</h2>
          <p className="text-orange-600">Connect and communicate with parents effectively</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Send Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-green-800">Subject</label>
                <input 
                  type="text" 
                  placeholder="Enter announcement subject"
                  className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-green-800">Message</label>
                <textarea 
                  placeholder="Type your message to parents..."
                  rows={4}
                  className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                Send to All Parents
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Recent Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { subject: "Parent-Teacher Meeting Reminder", date: "2 days ago" },
                  { subject: "Monthly Progress Report", date: "1 week ago" },
                  { subject: "School Event Announcement", date: "2 weeks ago" }
                ].map((comm, i) => (
                  <div key={i} className="p-3 bg-white border border-orange-200 rounded-lg">
                    <p className="font-medium text-green-800">{comm.subject}</p>
                    <p className="text-sm text-orange-600">{comm.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const AttendanceTrackerPage = () => {
    const classStudents = getStudentsForClass()
    
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 via-white to-green-100 p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Attendance Tracker</h2>
          <p className="text-green-600">Track and manage student attendance</p>
        </div>
        
        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Today's Attendance</CardTitle>
            <CardDescription className="text-orange-600">Mark attendance for {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{student.name}</p>
                      <p className="text-sm text-orange-600">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={attendance[student.id] === "p" ? "default" : "outline"}
                      className={attendance[student.id] === "p" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "border-green-300 text-green-600 hover:bg-green-50"
                      }
                      onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "p" }))}
                    >
                      Present
                    </Button>
                    <Button 
                      size="sm" 
                      variant={attendance[student.id] === "a" ? "destructive" : "outline"}
                      className={attendance[student.id] === "a" 
                        ? "" 
                        : "border-orange-300 text-orange-600 hover:bg-orange-50"
                      }
                      onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "a" }))}
                    >
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
              onClick={() => {
                // Save attendance logic here
                alert("Attendance saved successfully!")
              }}
            >
              Save Attendance
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const CurriculumStandardsPage = () => {
    const curriculumStandards = [
      { id: 'ncert-math', name: 'NCERT Mathematics', grade: 'Grade 10', chapters: 15 },
      { id: 'ncert-science', name: 'NCERT Science', grade: 'Grade 10', chapters: 12 },
      { id: 'ncert-english', name: 'NCERT English', grade: 'Grade 10', chapters: 18 },
      { id: 'ncert-social', name: 'NCERT Social Studies', grade: 'Grade 10', chapters: 20 }
    ]

    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Curriculum Standards</h2>
          <p className="text-orange-600">Manage NCERT and state curriculum standards</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curriculumStandards.map((standard, index) => (
            <Card 
              key={standard.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br ${
                index % 2 === 0 
                  ? 'from-orange-50 to-white border-orange-200' 
                  : 'from-green-50 to-white border-green-200'
              }`}
              onClick={() => setSelectedCurriculumStandard(standard.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`bg-${index % 2 === 0 ? 'orange' : 'green'}-100 p-3 rounded-full`}>
                    <BookOpen className={`h-6 w-6 text-${index % 2 === 0 ? 'orange' : 'green'}-600`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold text-${index % 2 === 0 ? 'orange' : 'green'}-800`}>
                      {standard.name}
                    </h3>
                    <p className={`text-sm text-${index % 2 === 0 ? 'orange' : 'green'}-600`}>
                      {standard.grade}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Chapters: {standard.chapters}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={`border-${index % 2 === 0 ? 'orange' : 'green'}-300 text-${index % 2 === 0 ? 'orange' : 'green'}-600 hover:bg-${index % 2 === 0 ? 'orange' : 'green'}-50`}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const AssessmentToolsPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 via-white to-green-100 p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Assessment Tools</h2>
          <p className="text-green-600">Create and manage assessments, quizzes, and tests</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { name: 'Quick Quiz', icon: Timer, color: 'orange' },
            { name: 'Assignment', icon: FileText, color: 'green' },
            { name: 'Test Paper', icon: BookOpen, color: 'orange' },
            { name: 'Project', icon: FolderOpen, color: 'green' },
            { name: 'Oral Assessment', icon: MessageSquare, color: 'orange' },
            { name: 'Practical Exam', icon: Settings, color: 'green' }
          ].map((tool) => (
            <Card 
              key={tool.name}
              className={`cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br ${
                tool.color === 'orange' 
                  ? 'from-orange-50 to-orange-100 border-orange-200' 
                  : 'from-green-50 to-green-100 border-green-200'
              }`}
              onClick={() => setCurrentPage("create-assignment")}
            >
              <CardContent className="p-4 text-center">
                <div className={`bg-${tool.color}-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center`}>
                  <tool.icon className={`h-6 w-6 text-${tool.color}-600`} />
                </div>
                <h3 className={`font-semibold text-${tool.color}-800`}>{tool.name}</h3>
                <Button 
                  size="sm" 
                  className={`mt-2 bg-gradient-to-r ${
                    tool.color === 'orange'
                      ? 'from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700'
                      : 'from-green-500 to-orange-600 hover:from-green-600 hover:to-orange-700'
                  }`}
                >
                  Create
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const CreateAssignmentPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Create Assignment</h2>
          <p className="text-orange-600">Design new assignments for your students</p>
        </div>
        
        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-green-800">Assignment Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter assignment title"
                    className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-green-800">Subject</label>
                  <select className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Social Studies</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-green-800">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-green-800">Points</label>
                  <input 
                    type="number" 
                    placeholder="Total points"
                    className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-green-800">Assignment Description</label>
                <textarea 
                  placeholder="Provide detailed instructions for the assignment..."
                  rows={4}
                  className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-green-800">Attach Resources</label>
                <div className="mt-2 border-2 border-dashed border-orange-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-orange-600">Click to upload files or drag and drop</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                  Create Assignment
                </Button>
                <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  Save as Draft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const GradeAssignmentPage = () => {
    const classStudents = getStudentsForClass()
    
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 via-white to-green-100 p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Grade Assignment</h2>
          <p className="text-green-600">Review and grade student submissions</p>
        </div>
        
        {selectedAssignment && (
          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">{selectedAssignment.title}</CardTitle>
              <CardDescription className="text-orange-600">
                {selectedAssignment.submissions.length} of {selectedAssignment.total} submitted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedAssignment.submissions.map((submission) => {
                  const student = classStudents.find(s => s.id === submission.studentId)
                  return (
                    <div key={submission.studentId} className="p-4 bg-white border border-orange-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-green-800">{submission.studentName}</p>
                          <p className="text-sm text-orange-600">Submitted: {submission.submittedAt}</p>
                        </div>
                        <Badge variant={submission.status === "submitted" ? "default" : "secondary"}>
                          {submission.status}
                        </Badge>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-green-800">Score</label>
                          <input 
                            type="number" 
                            placeholder="Enter score"
                            max={selectedAssignment.total}
                            className="w-20 mt-1 p-1 border border-orange-300 rounded focus:ring-2 focus:ring-green-500"
                            defaultValue={submission.score}
                          />
                          <span className="text-sm text-muted-foreground ml-1">/ {selectedAssignment.total}</span>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                        >
                          Save Grade
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const StudentProfilePage = () => {
    if (!selectedStudent) return null
    
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Student Profile</h2>
          <p className="text-orange-600">Detailed view of {selectedStudent.name}'s academic progress</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">{selectedStudent.name}</h3>
              <p className="text-orange-600">Grade {selectedStudent.grade}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">XP Points</span>
                  <span className="text-sm font-medium text-green-600">{selectedStudent.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Attendance</span>
                  <span className="text-sm font-medium text-green-600">{selectedStudent.attendance}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Academic Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: 'Mathematics', score: 85, trend: 'up' },
                    { subject: 'Science', score: 92, trend: 'up' },
                    { subject: 'English', score: 78, trend: 'down' },
                    { subject: 'Social Studies', score: 88, trend: 'up' }
                  ].map((subject) => (
                    <div key={subject.subject} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">{subject.subject}</p>
                        <p className="text-sm text-orange-600">Latest Assessment</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{subject.score}%</p>
                        <div className={`flex items-center text-sm ${
                          subject.trend === 'up' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {subject.trend === 'up' ? 
                            <TrendingUp className="h-3 w-3 mr-1" /> : 
                            <TrendingDown className="h-3 w-3 mr-1" />
                          }
                          {subject.trend === 'up' ? 'Improving' : 'Needs attention'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const AssignmentSubmissionsPage = () => {
    if (!selectedAssignment) return null
    
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 via-white to-green-100 p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Assignment Submissions</h2>
          <p className="text-green-600">Review submissions for: {selectedAssignment.title}</p>
        </div>
        
        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Submission Overview</CardTitle>
            <CardDescription className="text-orange-600">
              {selectedAssignment.submissions.length} of {selectedAssignment.total} students have submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedAssignment.submissions.map((submission) => (
                <div key={submission.studentId} className="p-4 bg-white border border-orange-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-green-800">{submission.studentName}</p>
                      <p className="text-sm text-orange-600">Submitted: {submission.submittedAt}</p>
                      {submission.score && (
                        <p className="text-sm text-green-600">Score: {submission.score}/{selectedAssignment.total}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        View Submission
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-orange-600 hover:from-green-600 hover:to-orange-700"
                        onClick={() => setCurrentPage("grade-assignment")}
                      >
                        Grade
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const QuizResultsPage = () => {
    if (!selectedQuiz) return null
    
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Quiz Results</h2>
          <p className="text-orange-600">Results for: {selectedQuiz.title}</p>
        </div>
        
        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Quiz Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedQuiz.results?.length || 0}</div>
                <p className="text-sm text-green-800">Total Attempts</p>
              </div>
              <div className="text-center p-4 bg-white border border-orange-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {selectedQuiz.results?.length ? 
                    Math.round(selectedQuiz.results.reduce((acc, r) => acc + r.score, 0) / selectedQuiz.results.length) : 0
                  }%
                </div>
                <p className="text-sm text-gray-800">Average Score</p>
              </div>
              <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {selectedQuiz.results?.filter(r => r.score >= 80).length || 0}
                </div>
                <p className="text-sm text-orange-800">High Scorers (80%+)</p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedQuiz.results?.map((result, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white border border-green-200 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">{result.studentName}</p>
                    <p className="text-sm text-orange-600">Completed: {result.completedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{result.score}%</p>
                    <p className={`text-sm ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-orange-600' : 'text-red-500'}`}>
                      {result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Improvement'}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-center text-muted-foreground py-8">No results available yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ReportsPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 via-white to-green-100 p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Reports & Analytics</h2>
          <p className="text-green-600">Generate comprehensive reports for your classes</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { name: 'Student Progress Report', icon: TrendingUp, color: 'orange' },
            { name: 'Attendance Report', icon: Calendar, color: 'green' },
            { name: 'Assignment Report', icon: FileText, color: 'orange' },
            { name: 'Class Performance', icon: BarChart3, color: 'green' },
            { name: 'Parent Report Card', icon: User, color: 'orange' },
            { name: 'Curriculum Coverage', icon: BookOpen, color: 'green' }
          ].map((report) => (
            <Card 
              key={report.name}
              className={`cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br ${
                report.color === 'orange' 
                  ? 'from-orange-50 to-orange-100 border-orange-200' 
                  : 'from-green-50 to-green-100 border-green-200'
              }`}
            >
              <CardContent className="p-4 text-center">
                <div className={`bg-${report.color}-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center`}>
                  <report.icon className={`h-6 w-6 text-${report.color}-600`} />
                </div>
                <h3 className={`font-semibold text-${report.color}-800 mb-2`}>{report.name}</h3>
                <Button 
                  size="sm"
                  className={`bg-gradient-to-r ${
                    report.color === 'orange'
                      ? 'from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700'
                      : 'from-green-500 to-orange-600 hover:from-green-600 hover:to-orange-700'
                  }`}
                  onClick={() => {
                    // Generate report logic here
                    alert(`${report.name} generated successfully!`)
                  }}
                >
                  Generate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const SettingsPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-orange-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Settings</h2>
          <p className="text-orange-600">Customize your teaching portal preferences</p>
        </div>
        
        <div className="grid gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-green-800">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.displayName || ""}
                    className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-green-800">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email || ""}
                    className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Student assignment submissions',
                'Parent messages',
                'School announcements',
                'System updates'
              ].map((notification, index) => (
                <div key={notification} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                  <span className="text-green-800">{notification}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-${index % 2 === 0 ? 'orange' : 'green'}-300 text-${index % 2 === 0 ? 'orange' : 'green'}-600 hover:bg-${index % 2 === 0 ? 'orange' : 'green'}-50`}
                    onClick={() => {
                      alert(`${notification} ${Math.random() > 0.5 ? "enabled" : "disabled"}`)
                    }}
                  >
                    {Math.random() > 0.5 ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Support Pages with Indian Flag Colors
  const HelpFAQPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 to-white p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Help & FAQ</h2>
          <p className="text-orange-600">Frequently asked questions and help resources</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Admin Department Contact</CardTitle>
              <CardDescription className="text-green-600">For general inquiries and support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-600" />
                <span>admin@school.edu.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>Office Hours: 9 AM - 5 PM</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-white border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Common Questions</CardTitle>
              <CardDescription className="text-green-600">Quick answers to frequent queries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">How to create assignments?</h4>
                <p className="text-sm text-muted-foreground">Go to Content Management > Create Assignment</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-800">How to track student progress?</h4>
                <p className="text-sm text-muted-foreground">Check Analytics > Performance Reports</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">How to communicate with parents?</h4>
                <p className="text-sm text-muted-foreground">Use the Parent Communication feature</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          onClick={() => setCurrentPage("home")} 
          className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
        >
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const TechnicalSupportPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-white to-green-100 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Technical Support</h2>
          <p className="text-green-600">24/7 technical assistance and engineering support</p>
        </div>
        
        <div className="grid gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Engineering Team Contact</CardTitle>
              <CardDescription className="text-orange-600">For technical issues and system support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                <span>tech@school.edu.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-orange-600" />
                <span>+91-9876543211</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span>Support Hours: 24/7</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Common Technical Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-800">Login Issues</h4>
                <p className="text-sm text-muted-foreground">Clear browser cache or contact support</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">File Upload Problems</h4>
                <p className="text-sm text-muted-foreground">Check file size limits and format</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-800">Performance Issues</h4>
                <p className="text-sm text-muted-foreground">Try refreshing the page or contact support</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          onClick={() => setCurrentPage("support")} 
          className="bg-gradient-to-r from-green-500 to-orange-600 hover:from-green-600 hover:to-orange-700"
        >
          Back to Support
        </Button>
      </div>
    )
  }

  const TeachingResourcesPage = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-white p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Teaching Resources</h2>
          <p className="text-green-600">NCERT and Educational Resources for effective teaching</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teachingResources.map((resource, index) => (
            <Card key={resource.title} className={`hover:shadow-md transition-shadow ${
              index % 2 === 0 ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200' : 'bg-gradient-to-br from-white to-green-50 border-green-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    index % 2 === 0 ? 'bg-orange-200' : 'bg-green-200'
                  }`}>
                    <BookOpen className={`h-5 w-5 ${
                      index % 2 === 0 ? 'text-orange-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${
                      index % 2 === 0 ? 'text-orange-800' : 'text-green-800'
                    }`}>{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={`w-full ${
                        index % 2 === 0 
                          ? 'border-orange-300 text-orange-600 hover:bg-orange-50' 
                          : 'border-green-300 text-green-600 hover:bg-green-50'
                      }`}
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      Access Resource
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button 
          onClick={() => setCurrentPage("support")} 
          className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
        >
          Back to Support
        </Button>
      </div>
    )
  }

  const NotificationsPage = () => {
    const notifications = [
      { id: 1, title: "New student enrolled", message: "Rahul Kumar has joined your Math Class 10", time: "2 hours ago", type: "info" },
      { id: 2, title: "Assignment submitted", message: "15 students submitted Algebra homework", time: "4 hours ago", type: "success" },
      { id: 3, title: "Parent meeting request", message: "Mrs. Sharma wants to discuss her child's progress", time: "1 day ago", type: "warning" },
      { id: 4, title: "Low attendance alert", message: "3 students have less than 75% attendance", time: "2 days ago", type: "error" },
      { id: 5, title: "Quiz results available", message: "Mathematics quiz results are ready for review", time: "3 days ago", type: "success" },
    ]

    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-orange-100 to-white p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-800">Notifications</h2>
          <p className="text-orange-600">Stay updated with all classroom activities</p>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`hover:shadow-md transition-shadow ${
              notification.type === 'success' ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' :
              notification.type === 'warning' ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200' :
              notification.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' :
              'bg-gradient-to-r from-white to-green-50 border-green-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-200' :
                    notification.type === 'warning' ? 'bg-orange-200' :
                    notification.type === 'error' ? 'bg-red-200' :
                    'bg-blue-200'
                  }`}>
                    <Bell className={`h-4 w-4 ${
                      notification.type === 'success' ? 'text-green-600' :
                      notification.type === 'warning' ? 'text-orange-600' :
                      notification.type === 'error' ? 'text-red-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold ${
                        notification.type === 'success' ? 'text-green-800' :
                        notification.type === 'warning' ? 'text-orange-800' :
                        notification.type === 'error' ? 'text-red-800' :
                        'text-blue-800'
                      }`}>{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button 
          onClick={() => setCurrentPage("home")} 
          className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
        >
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const DetailedAnalyticsPage = () => {
    const classStudents = getStudentsForClass()
    const analyticsData = {
      avgClassScore: 84,
      engagementRate: 67,
      avgStudyTime: 2.8,
      completionRate: 73
    }

    return (
      <div className="space-y-6">
        <div className="mb-6 bg-gradient-to-r from-green-100 to-white p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-800">Detailed Analytics</h2>
          <p className="text-green-600">Comprehensive insights into class performance and engagement</p>
        </div>
        
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-200 p-3 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-800">{analyticsData.avgClassScore}%</h3>
              <p className="text-sm text-orange-600">Average Class Score</p>
              <p className="text-xs text-muted-foreground mt-1">Recent quiz average</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="bg-green-200 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800">{analyticsData.engagementRate}%</h3>
              <p className="text-sm text-green-600">Engagement Rate</p>
              <p className="text-xs text-muted-foreground mt-1">Daily portal users</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="bg-green-200 p-3 rounded-full w-fit mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800">{analyticsData.avgStudyTime}h</h3>
              <p className="text-sm text-green-600">Avg. Study Time</p>
              <p className="text-xs text-muted-foreground mt-1">Portal usage/week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-200 p-3 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-800">{analyticsData.completionRate}%</h3>
              <p className="text-sm text-orange-600">Completion Rate</p>
              <p className="text-xs text-muted-foreground mt-1">Assignment completion</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Student Performance Details */}
        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Individual Student Performance</CardTitle>
            <CardDescription className="text-green-600">Detailed breakdown by student</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classStudents.map((student, index) => (
                <div key={student.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  index % 2 === 0 ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      index % 2 === 0 ? 'bg-orange-200' : 'bg-green-200'
                    }`}>
                      <User className={`h-4 w-4 ${
                        index % 2 === 0 ? 'text-orange-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${
                        index % 2 === 0 ? 'text-orange-800' : 'text-green-800'
                      }`}>{student.name}</h4>
                      <p className="text-sm text-muted-foreground">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className={`font-semibold ${
                        index % 2 === 0 ? 'text-orange-800' : 'text-green-800'
                      }`}>{student.xp} XP</p>
                      <p className="text-muted-foreground">Total Points</p>
                    </div>
                    <div className="text-center">
                      <p className={`font-semibold ${
                        index % 2 === 0 ? 'text-orange-800' : 'text-green-800'
                      }`}>{student.attendance}%</p>
                      <p className="text-muted-foreground">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className={`font-semibold ${
                        index % 2 === 0 ? 'text-orange-800' : 'text-green-800'
                      }`}>{Math.round(student.xp / 15)}%</p>
                      <p className="text-muted-foreground">Performance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={() => setCurrentPage("analytics")} 
          className="bg-gradient-to-r from-green-500 to-orange-600 hover:from-green-600 hover:to-orange-700"
        >
          Back to Analytics
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-secondary/10 p-2 rounded-lg">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Teacher Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => setCurrentPage(item.id as TeacherPage)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setCurrentPage("notifications")
              }}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                signOut()
                window.location.href = "/"
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{renderPage()}</main>
    </div>
  )
}
