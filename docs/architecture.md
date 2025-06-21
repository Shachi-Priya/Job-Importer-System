# 🧱 System Architecture - Scalable Job Importer

## 1. Overview

The system is designed to fetch job data from external XML-based job feeds, convert them to JSON, queue them using BullMQ (Redis), process the jobs via workers, and store them into MongoDB. Each import run is tracked in a log collection for audit and UI display.

---

## 2. High-Level Architecture

        +----------------------+
        | External Job APIs    |
        | (RSS/XML Feeds)      |
        +----------+-----------+
                   |
                   v
          +--------+---------+
          |   Cron Job       | Every hour
          | (Node.js Server) |
          +--------+---------+
                   |
                   v
          +--------+----------+
          | Job Queue (Redis) |
          +--------+----------+
                   |
                   v
            +------+------+
            |   Worker    | (BullMQ)
            +------+------+
                   |
                   v
         +---------+----------+
         | MongoDB (Jobs DB)  |
         | - jobs             |
         | - import_logs      |
         +-------------------+

                    |
                    v
            +---------------+
            | Admin UI (Next.js) |
            +---------------+


---

## 3. Key Components

### 3.1 Cron Job (Scheduler)
- Runs every 1 hour.
- Fetches jobs from configured XML feeds.
- Converts XML → JSON using `xml2js`.
- Queues each job to Redis with BullMQ.

### 3.2 Queue (Redis + BullMQ)
- Handles background processing of jobs.
- Workers process each job: validate, upsert to DB.
- Retries on failure with exponential backoff.

### 3.3 Worker (Processor)
- Consumes jobs from Redis queue.
- Validates job schema.
- Inserts new jobs or updates existing ones.
- Logs status (`new`, `updated`, `failed`) to `import_logs`.

### 3.4 Database (MongoDB)
- `jobs`: Main collection with job data.
- `import_logs`: Stores stats for each import run:
  - `timestamp`, `totalFetched`, `totalImported`, `newJobs`, `updatedJobs`, `failedJobs` (with reason).

### 3.5 Admin UI (Next.js)
- Fetches logs from backend (`/import-logs`).
- Displays tabular view of each import run.

---

## 4. Design Decisions

- **BullMQ over Bull**: Chosen for better Redis Streams support and modern API.
- **MongoDB Atlas**: Reliable, cloud-managed DB.
- **Redis Cloud**: Hosted, avoids local Redis setup.
- **XML Parsing**: Used `xml2js` for robust XML → JSON conversion.
- **Modularity**: Backend organized by `routes`, `services`, `workers`, and `utils`.

---

## 5. Scalability

- Workers are decoupled and can be scaled horizontally.
- Redis and MongoDB support vertical and horizontal scaling.
- Cron job frequency is configurable.
- Job processing concurrency is configurable (future enhancement).

---

## 6. Future Enhancements

- Add real-time import log updates using **Socket.IO** or **Server-Sent Events**.
- Add **batch processing** support for feeds with thousands of jobs.
- Add **webhook or email notifications** for failures.
- Dockerize for containerized deployments.

---

## 7. Conclusion

This architecture is cleanly separated, fault-tolerant, and horizontally scalable. It allows fast job imports, tracks system status, and gives visibility to operations through an admin dashboard.
