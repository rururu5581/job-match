
import { useState, useEffect } from 'react';
import { JobOpening } from '../types';
import { MOCK_CSV_DATA, CSV_HEADERS, CSV_COLUMN_MAP } from '../constants';

const parseCSV = (csvString: string): JobOpening[] => {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return []; // Header + at least one data row

  const dataLines = lines.slice(1);
  const jobOpenings: JobOpening[] = [];

  dataLines.forEach((line, index) => {
    const values = line.split(',');
    if (values.length < CSV_HEADERS.length) {
        // console.warn(`Skipping malformed CSV line ${index + 2}: ${line}`);
        return; // Skip if not enough columns
    }

    const rawData: { [key: string]: string } = {};
    CSV_HEADERS.forEach((header, i) => {
      rawData[header] = values[i] ? values[i].trim() : '';
    });
    
    const getNum = (colNameKey: string): number | null => {
        const headerIndex = CSV_COLUMN_MAP[colNameKey];
        if (typeof headerIndex !== 'number') return null; // Ensure it's a number
        const colName = CSV_HEADERS[headerIndex];
        if (!colName) return null; // Ensure headerIndex is valid

        const valStr = rawData[colName];
        if (!valStr) return null;
        const num = parseInt(valStr, 10);
        return isNaN(num) ? null : num;
    };

    const getString = (colNameKey: string, defaultValue: string = ''): string => {
        const headerIndex = CSV_COLUMN_MAP[colNameKey];
        if (typeof headerIndex !== 'number') return defaultValue;
        const colName = CSV_HEADERS[headerIndex];
        if (!colName) return defaultValue;
        return rawData[colName] || defaultValue;
    };

    const jobIdIndex = CSV_COLUMN_MAP.JOB_ID;
    const jobIdHeader = typeof jobIdIndex === 'number' ? CSV_HEADERS[jobIdIndex] : undefined;
    const id = (jobIdHeader ? rawData[jobIdHeader] : undefined) || `JOB_MOCK_${index}`;

    const job: JobOpening = {
      id: id,
      companyName: getString('COMPANY_NAME', 'N/A'),
      position: getString('POSITION', 'N/A'),
      jobDescription: getString('JOB_DESCRIPTION'),
      idealCandidate: getString('IDEAL_CANDIDATE'),
      location: getString('LOCATION'),
      qualifications: getString('QUALIFICATIONS'),
      keywords: getString('KEYWORDS'),
      minSalary: getNum('MIN_SALARY'),
      maxSalary: getNum('MAX_SALARY'),
      raw: rawData,
    };
    jobOpenings.push(job);
  });

  return jobOpenings;
};

export const useMockJobData = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate async data fetching
    const timer = setTimeout(() => {
      try {
        const parsedData = parseCSV(MOCK_CSV_DATA);
        setJobOpenings(parsedData);
      } catch (e) {
        console.error("Failed to parse CSV data:", e);
        setError("求人データの解析に失敗しました。");
      } finally {
        setLoading(false);
      }
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return { jobOpenings, loading, error };
};
