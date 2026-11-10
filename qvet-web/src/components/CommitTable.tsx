import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";

import CommitRow from "src/components/CommitRow";
import { Commit } from "src/octokitHelpers";

import TableHeader from "./TableHeader";

// Each row fetches its own QA status, so only render (and query) one page at a time.
const ROWS_PER_PAGE_OPTIONS = [25, 50, 100];

export default function CommitTable({
  commits,
  showHeader,
}: {
  commits: ReadonlyArray<Commit>;
  showHeader: boolean;
}): React.ReactElement {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  // Filtering can shrink the list beneath the current page.
  const lastPage = Math.max(0, Math.ceil(commits.length / rowsPerPage) - 1);
  const currentPage = Math.min(page, lastPage);
  const pageCommits = commits.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage,
  );

  return (
    <>
      {showHeader && <TableHeader title="Commits" />}
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Message</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Hash</TableCell>
            <TableCell>Manual QA</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageCommits.map((commit) => (
            <CommitRow key={commit.sha} commit={commit} />
          ))}
        </TableBody>
      </Table>
      {commits.length > ROWS_PER_PAGE_OPTIONS[0] && (
        <TablePagination
          component="div"
          count={commits.length}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      )}
    </>
  );
}
