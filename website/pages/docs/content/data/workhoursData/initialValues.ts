export interface WorkLog {
    id: number;
    date?: Date;
    project: string;
    employee: string;
    hours: number;
    description: string;
}

const data = [
    {
        id: 0,
        project: "CRM for construction company",
        employee: "Christina West",
        hours: 6,
        projects: "CRM for construction company",
        date: "2020-10-12T05:44:32.915Z"
    },
    {
        id: 1,
        project: "CRM for construction company",
        employee: "Christina West",
        hours: 2,
        projects: "CRM for construction company",
        date: "2020-10-16T19:27:52.967Z"
    },
    {
        id: 2,
        project: "CRM for construction company",
        employee: "Christina West",
        hours: 6,
        projects: "New mobile app",
        date: "2020-10-18T16:42:49.855Z"
    },
    {
        id: 3,
        project: "CRM for construction company",
        employee: "Christina West",
        hours: 5,
        projects: "CRM for construction company",
        date: "2020-10-11T14:09:16.619Z"
    },
    {
        id: 4,
        project: "Advocate office website",
        employee: "Alice Quartz",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-17T17:06:18.978Z"
    },
    {
        id: 5,
        project: "Advocate office website",
        employee: "Alice Quartz",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-16T01:35:04.990Z"
    },
    {
        id: 6,
        project: "Advocate office website",
        employee: "Alice Quartz",
        hours: 8,
        projects: "New mobile app",
        date: "2020-10-16T15:15:50.824Z"
    },
    {
        id: 7,
        project: "Advocate office website",
        employee: "Alice Quartz",
        hours: 6,
        projects: "New mobile app",
        date: "2020-10-17T11:42:11.719Z"
    },
    {
        id: 8,
        project: "CRM for construction company",
        employee: "Andrew Pulaski",
        hours: 6,
        projects: "CRM for construction company",
        date: "2020-10-15T14:54:13.789Z"
    },
    {
        id: 9,
        project: "CRM for construction company",
        employee: "Andrew Pulaski",
        hours: 8,
        projects: "New mobile app",
        date: "2020-10-13T06:39:45.710Z"
    },
    {
        id: 10,
        project: "CRM for construction company",
        employee: "Andrew Pulaski",
        hours: 6,
        projects: "Advocate office website",
        date: "2020-10-19T01:09:19.915Z"
    },
    {
        id: 11,
        project: "CRM for construction company",
        employee: "Andrew Pulaski",
        hours: 8,
        projects: "Advocate office website",
        date: "2020-10-20T16:23:24.437Z"
    },
    {
        id: 12,
        project: "CRM for construction company",
        employee: "Andrew Pulaski",
        hours: 8,
        projects: "New mobile app",
        date: "2020-10-19T18:47:21.191Z"
    },
    {
        id: 13,
        project: "CRM for construction company",
        employee: "Andrew Pulaski",
        hours: 6,
        projects: "Advocate office website",
        date: "2020-10-14T17:50:54.448Z"
    },
    {
        id: 14,
        project: "CRM for construction company",
        employee: "Andrew Pulaski",
        hours: 8,
        projects: "New mobile app",
        date: "2020-10-20T17:52:28.275Z"
    },
    {
        id: 15,
        project: "New mobile app",
        employee: "Thomas Lee",
        hours: 6,
        projects: "CRM for construction company",
        date: "2020-10-14T01:11:55.371Z"
    },
    {
        id: 16,
        project: "New mobile app",
        employee: "Thomas Lee",
        hours: 8,
        projects: "New mobile app",
        date: "2020-10-22T00:48:59.543Z"
    },
    {
        id: 17,
        project: "New mobile app",
        employee: "Thomas Lee",
        hours: 6,
        projects: "Advocate office website",
        date: "2020-10-20T22:05:25.985Z"
    },
    {
        id: 18,
        project: "New mobile app",
        employee: "Thomas Lee",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-14T14:31:26.631Z"
    },
    {
        id: 19,
        project: "New mobile app",
        employee: "Thomas Lee",
        hours: 6,
        projects: "CRM for construction company",
        date: "2020-10-22T09:38:13.979Z"
    },
    {
        id: 20,
        project: "New mobile app",
        employee: "Thomas Lee",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-12T05:05:20.152Z"
    },
    {
        id: 21,
        project: "New mobile app",
        employee: "Thomas Lee",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-14T02:31:43.625Z"
    },
    {
        id: 22,
        project: "Website for the animal shelter",
        employee: "Tom Jameson",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-21T23:41:15.156Z"
    },
    {
        id: 23,
        project: "Website for the animal shelter",
        employee: "Tom Jameson",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-14T09:24:55.733Z"
    },
    {
        id: 24,
        project: "Website for the animal shelter",
        employee: "Tom Jameson",
        hours: 6,
        projects: "New mobile app",
        date: "2020-10-13T05:01:12.812Z"
    },
    {
        id: 25,
        project: "Website for the animal shelter",
        employee: "Tom Jameson",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-17T15:24:25.783Z"
    },
    {
        id: 26,
        project: "Website for the animal shelter",
        employee: "Tom Jameson",
        hours: 6,
        projects: "New mobile app",
        date: "2020-10-11T22:24:45.843Z"
    },
    {
        id: 27,
        project: "New mobile app",
        employee: "Pamela Wilson",
        hours: 7,
        projects: "CRM for construction company",
        date: "2020-10-16T00:02:19.619Z"
    },
    {
        id: 28,
        project: "New mobile app",
        employee: "Pamela Wilson",
        hours: 6,
        projects: "CRM for construction company",
        date: "2020-10-19T12:19:41.935Z"
    },
    {
        id: 29,
        project: "New mobile app",
        employee: "Pamela Wilson",
        hours: 7,
        projects: "New mobile app",
        date: "2020-10-12T13:41:51.420Z"
    },
    {
        id: 30,
        project: "New mobile app",
        employee: "Pamela Wilson",
        hours: 7,
        projects: "New mobile app",
        date: "2020-10-20T04:37:24.994Z"
    },
    {
        id: 31,
        project: "New mobile app",
        employee: "Pamela Wilson",
        hours: 6,
        projects: "Advocate office website",
        date: "2020-10-20T23:49:59.783Z"
    },
    {
        id: 32,
        project: "New mobile app",
        employee: "Pamela Wilson",
        hours: 6,
        projects: "CRM for construction company",
        date: "2020-10-22T06:12:19.197Z"
    },
    {
        id: 33,
        project: "CRM for construction company",
        employee: "Patrick Morgan",
        hours: 7,
        projects: "Advocate office website",
        date: "2020-10-19T04:33:32.797Z"
    },
    {
        id: 34,
        project: "CRM for construction company",
        employee: "Patrick Morgan",
        hours: 7,
        projects: "Advocate office website",
        date: "2020-10-22T05:25:52.919Z"
    },
    {
        id: 35,
        project: "CRM for construction company",
        employee: "Patrick Morgan",
        hours: 9,
        projects: "CRM for construction company",
        date: "2020-10-15T20:55:53.111Z"
    },
    {
        id: 36,
        project: "CRM for construction company",
        employee: "Patrick Morgan",
        hours: 9,
        projects: "Advocate office website",
        date: "2020-10-12T17:10:39.302Z"
    },
    {
        id: 37,
        project: "CRM for construction company",
        employee: "Patrick Morgan",
        hours: 6,
        projects: "CRM for construction company",
        date: "2020-10-20T03:08:37.109Z"
    },
    {
        id: 38,
        project: "Advocate office website",
        employee: "Robert Williams",
        hours: 6,
        projects: "New mobile app",
        date: "2020-10-20T14:29:25.362Z"
    },
    {
        id: 39,
        project: "Advocate office website",
        employee: "Robert Williams",
        hours: 7,
        projects: "New mobile app",
        date: "2020-10-15T00:23:33.471Z"
    },
    {
        id: 40,
        project: "Advocate office website",
        employee: "Robert Williams",
        hours: 8,
        projects: "Advocate office website",
        date: "2020-10-18T00:07:56.588Z"
    },
    {
        id: 41,
        project: "Advocate office website",
        employee: "Robert Williams",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-22T02:45:11.172Z"
    },
    {
        id: 42,
        project: "Advocate office website",
        employee: "Robert Williams",
        hours: 8,
        projects: "CRM for construction company",
        date: "2020-10-15T21:59:25.147Z"
    },
    {
        id: 43,
        project: "New mobile app",
        employee: "Mark O'Brien",
        hours: 2,
        projects: "CRM for construction company",
        date: "2020-10-21T17:19:44.738Z"
    },
    {
        id: 44,
        project: "New mobile app",
        employee: "Mark O'Brien",
        hours: 3,
        projects: "New mobile app",
        date: "2020-10-21T03:27:09.145Z"
    },
    {
        id: 45,
        project: "New mobile app",
        employee: "Mark O'Brien",
        hours: 2,
        projects: "CRM for construction company",
        date: "2020-10-19T16:16:44.594Z"
    },
    {
        id: 46,
        project: "New mobile app",
        employee: "Mark O'Brien",
        hours: 4,
        projects: "New mobile app",
        date: "2020-10-21T06:47:05.412Z"
    },
    {
        id: 47,
        project: "New mobile app",
        employee: "Mark O'Brien",
        hours: 5,
        projects: "CRM for construction company",
        date: "2020-10-12T10:09:53.167Z"
    },
    {
        id: 48,
        project: "New mobile app",
        employee: "Mark O'Brien",
        hours: 7,
        projects: "CRM for construction company",
        date: "2020-10-14T23:02:10.527Z"
    },
    {
        id: 49,
        project: "Website for the animal shelter",
        employee: "Andy Guttierez",
        hours: 8,
        projects: "Advocate office website",
        date: "2020-10-19T21:47:41.245Z"
    },
    {
        id: 50,
        project: "Website for the animal shelter",
        employee: "Andy Guttierez",
        hours: 8,
        projects: "Advocate office website",
        date: "2020-10-14T22:58:01.967Z"
    },
    {
        id: 51,
        project: "Website for the animal shelter",
        employee: "Andy Guttierez",
        hours: 8,
        projects: "New mobile app",
        date: "2020-10-12T19:46:50.936Z"
    },
    {
        id: 52,
        project: "Website for the animal shelter",
        employee: "Andy Guttierez",
        hours: 8,
        projects: "New mobile app",
        date: "2020-10-13T21:50:37.121Z"
    },
    {
        id: 53,
        project: "Website for the animal shelter",
        employee: "Andy Guttierez",
        hours: 8,
        projects: "Advocate office website",
        date: "2020-10-14T09:14:58.490Z"
    },
    {
        id: 54,
        project: "Website for the animal shelter",
        employee: "Andy Guttierez",
        hours: 8,
        projects: "New mobile app",
        date: "2020-10-12T17:47:12.725Z"
    }
]

export const initialWorkhours: WorkLog[] = data.map<WorkLog>(log => ({ ...log, date: new Date(log.date), description: '' }))

export const projects: string[] = [
    '',
    'CRM for construction company',
    'New mobile app',
    'Advocate office website',
    'Website for the animal shelter',
]