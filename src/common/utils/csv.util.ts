import { Response } from 'express';

export function streamCsv(
  res: Response,
  filename: string,
  headers: string[],
  rows: any[],
) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}"`,
  );

  res.write(headers.join(',') + '\n');

  for (const row of rows) {
    res.write(
      headers.map(h => `"${row[h] ?? ''}"`).join(',') + '\n',
    );
  }

  res.end();
}
