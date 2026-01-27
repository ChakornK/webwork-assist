import { Fragment } from "preact";
import { Unpoison } from "../lib/unpoison";
import SolveButton from "./components/SolveButton";

export default function App() {
  return (
    <Fragment>
      <Unpoison />
      <SolveButton />
    </Fragment>
  );
}
