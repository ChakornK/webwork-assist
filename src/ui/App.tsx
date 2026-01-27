import { Fragment } from "preact";
import { Unpoison } from "../lib/unpoison";

export default function App() {
  return (
    <Fragment>
      <Unpoison />
      <div>
        <button class={"btn"}>WebWork Assist</button>
      </div>
    </Fragment>
  );
}
