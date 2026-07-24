"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export function PeopleStep({
  onSubmit,
}: {
  onSubmit: (employees: number, salary: number) => void;
}) {
  const t = useTranslations("quiz");
  const [employees, setEmployees] = useState("");
  const [salary, setSalary] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const employeesNum = Number(employees);
    const salaryNum = Number(salary);
    if (employeesNum > 0 && salaryNum > 0) {
      onSubmit(employeesNum, salaryNum);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="quiz-employees" className="text-body-sm font-medium">
          {t("employeesLabel")}
        </label>
        <input
          id="quiz-employees"
          type="number"
          inputMode="numeric"
          min={1}
          required
          value={employees}
          onChange={(e) => setEmployees(e.target.value)}
          className="rounded-utility border border-fog bg-canvas px-4 py-3 text-body focus:border-2 focus:border-ink"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="quiz-salary" className="text-body-sm font-medium">
          {t("salaryLabel")}
        </label>
        <input
          id="quiz-salary"
          type="number"
          inputMode="numeric"
          min={1}
          required
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="rounded-utility border border-fog bg-canvas px-4 py-3 text-body focus:border-2 focus:border-ink"
        />
      </div>
      <button
        type="submit"
        className="mt-2 rounded-button bg-pure-black px-6 py-3 text-body font-medium text-canvas"
      >
        {t("continueButton")}
      </button>
    </form>
  );
}
