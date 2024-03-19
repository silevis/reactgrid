import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import TextCell from "../components/cellTemplates/TextCell";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";

const ROW_COUNT = 20;
const COLUMN_COUNT = 25;

export const BigGrid = () => {
  const [data, setData] = useState<(string | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 0 && j === 1) return null;
        if (i === 1 && j === 0) return null;
        if (i === 1 && j === 1) return null;

        if (i === 2 && j === 4) return null;
        if (i === 3 && j === 3) return null;
        if (i === 3 && j === 4) return null;

        if (i === 3 && j === 7) return null;
        if (i === 4 && j === 6) return null;
        if (i === 4 && j === 7) return null;

        if (i === 5 && j === 6) return null;
        if (i === 5 && j === 7) return null;

        if (i === 6 && j === 4) return null;

        if (i === 6 && j === 7) return null;
        if (i === 6 && j === 8) return null;

        return (
          `[${i.toString()}:${j.toString()}]` +
          [
            "Lorem ipsum dolor sit amet",
            "Reiciendis illum, nihil, ab officiis explicabo!",
            "Excepturi in adipisci omnis illo eveniet obcaecati!",
            "Doloremque, sit!",
          ][Math.floor(Math.random() * 4)]
        );
      });
    })
  );

  const cellMatrix = cellMatrixBuilder(({ addRows, addColumns, setCell }) => {
    data.forEach((row, i) => {
      addRows({
        id: i.toString(),
        // height: `${Math.floor(Math.random() * 5) + 1}fr`,
        height: "max-content",
      });
      row.forEach((val, j) => {
        if (i === 0)
          addColumns({
            id: j.toString(),
            // width: `${Math.floor(Math.random() * 3) + 1}fr`,
            width: "min-content",
          });
        if (val === null) return;

        setCell(i.toString(), j.toString(), TextCell, {
          text: val,
          onTextChanged: (newText) => {
            setData((prev) => {
              const next = [...prev];
              next[i][j] = newText;
              return next;
            });
          },
        });
      });
    });

    setCell(
      "0",
      "0",
      TextCell,
      { text: data[0][0] ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 2, rowSpan: 2 }
    );
    setCell(
      "2",
      "3",
      TextCell,
      { text: data[2][3] ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 2, rowSpan: 2 }
    );
    setCell(
      "3",
      "6",
      TextCell,
      { text: data[3][6] ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 2, rowSpan: 2 }
    );
    setCell("5", "4", TextCell, { text: data[5][4] ?? "", reverse: true, onTextChanged: () => null }, { rowSpan: 2 });
    setCell("5", "5", TextCell, { text: data[5][5] ?? "", reverse: true, onTextChanged: () => null }, { colSpan: 3 });
    setCell("6", "6", TextCell, { text: data[5][4] ?? "", reverse: true, onTextChanged: () => null }, { colSpan: 3 });
  });

  cellMatrix.columns[1].width = "7rem";

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          stickyTopRows={2}
          stickyLeftColumns={3}
          stickyRightColumns={2}
          stickyBottomRows={2}
          {...cellMatrix}
          styledRanges={[
            {
              range: { start: { rowId: "0", columnId: "5" }, end: { rowId: "14", columnId: "12" } },
              styles: { background: "red", color: "yellow" },
            },
            {
              range: { start: { rowId: "7", columnId: "10" }, end: { rowId: "10", columnId: "14" } },
              styles: { background: "green", color: "purple" },
            },
          ]}
          handleSelectArea={(selectedArea) => {}}
          handleFocusCell={(cellLocation) => {}}
        />
      </div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, repellendus, eligendi veritatis officiis placeat
        dolore possimus, quae debitis numquam voluptas repellat labore blanditiis animi ipsam alias totam laborum non
        omnis. Sapiente dolorem voluptatibus doloribus natus laudantium non exercitationem nostrum quibusdam sequi
        commodi, deleniti quaerat animi eveniet, alias id quam. Ipsam necessitatibus magnam rem asperiores et ea facilis
        esse voluptas distinctio autem, fuga earum minima natus, adipisci assumenda cupiditate eveniet soluta quaerat
        molestias hic iusto! At, ex! Odio ratione labore voluptas autem ut dignissimos at qui tenetur, excepturi esse
        dolores in praesentium nostrum quo porro iure ab eum voluptatibus. Cupiditate veritatis accusamus itaque
        pariatur, ut corrupti soluta vel rem quisquam dolore fuga eos porro similique quae quia. Quas velit odit quae
        debitis, rerum incidunt veritatis. Quam amet distinctio quidem dicta. Temporibus officiis praesentium nobis
        cumque eum quasi tenetur rerum dolores provident tempora quas dolorem ab quod itaque hic, iste impedit. Quam
        quaerat odio quidem incidunt veniam corporis tempora reiciendis consequuntur autem. Nemo iusto molestiae,
        temporibus consequuntur deleniti ipsa architecto saepe dolor at nostrum accusamus sequi natus reprehenderit ex,
        animi a tempora quaerat non eius, doloribus corrupti eligendi. Commodi, ut alias, soluta omnis nisi laudantium
        corporis sapiente molestias dolores quibusdam libero vitae.
      </div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, repellendus, eligendi veritatis officiis placeat
        dolore possimus, quae debitis numquam voluptas repellat labore blanditiis animi ipsam alias totam laborum non
        omnis. Sapiente dolorem voluptatibus doloribus natus laudantium non exercitationem nostrum quibusdam sequi
        commodi, deleniti quaerat animi eveniet, alias id quam. Ipsam necessitatibus magnam rem asperiores et ea facilis
        esse voluptas distinctio autem, fuga earum minima natus, adipisci assumenda cupiditate eveniet soluta quaerat
        molestias hic iusto! At, ex! Odio ratione labore voluptas autem ut dignissimos at qui tenetur, excepturi esse
        dolores in praesentium nostrum quo porro iure ab eum voluptatibus. Cupiditate veritatis accusamus itaque
        pariatur, ut corrupti soluta vel rem quisquam dolore fuga eos porro similique quae quia. Quas velit odit quae
        debitis, rerum incidunt veritatis. Quam amet distinctio quidem dicta. Temporibus officiis praesentium nobis
        cumque eum quasi tenetur rerum dolores provident tempora quas dolorem ab quod itaque hic, iste impedit. Quam
        quaerat odio quidem incidunt veniam corporis tempora reiciendis consequuntur autem. Nemo iusto molestiae,
        temporibus consequuntur deleniti ipsa architecto saepe dolor at nostrum accusamus sequi natus reprehenderit ex,
        animi a tempora quaerat non eius, doloribus corrupti eligendi. Commodi, ut alias, soluta omnis nisi laudantium
        corporis sapiente molestias dolores quibusdam libero vitae.
      </div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, repellendus, eligendi veritatis officiis placeat
        dolore possimus, quae debitis numquam voluptas repellat labore blanditiis animi ipsam alias totam laborum non
        omnis. Sapiente dolorem voluptatibus doloribus natus laudantium non exercitationem nostrum quibusdam sequi
        commodi, deleniti quaerat animi eveniet, alias id quam. Ipsam necessitatibus magnam rem asperiores et ea facilis
        esse voluptas distinctio autem, fuga earum minima natus, adipisci assumenda cupiditate eveniet soluta quaerat
        molestias hic iusto! At, ex! Odio ratione labore voluptas autem ut dignissimos at qui tenetur, excepturi esse
        dolores in praesentium nostrum quo porro iure ab eum voluptatibus. Cupiditate veritatis accusamus itaque
        pariatur, ut corrupti soluta vel rem quisquam dolore fuga eos porro similique quae quia. Quas velit odit quae
        debitis, rerum incidunt veritatis. Quam amet distinctio quidem dicta. Temporibus officiis praesentium nobis
        cumque eum quasi tenetur rerum dolores provident tempora quas dolorem ab quod itaque hic, iste impedit. Quam
        quaerat odio quidem incidunt veniam corporis tempora reiciendis consequuntur autem. Nemo iusto molestiae,
        temporibus consequuntur deleniti ipsa architecto saepe dolor at nostrum accusamus sequi natus reprehenderit ex,
        animi a tempora quaerat non eius, doloribus corrupti eligendi. Commodi, ut alias, soluta omnis nisi laudantium
        corporis sapiente molestias dolores quibusdam libero vitae.
      </div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, repellendus, eligendi veritatis officiis placeat
        dolore possimus, quae debitis numquam voluptas repellat labore blanditiis animi ipsam alias totam laborum non
        omnis. Sapiente dolorem voluptatibus doloribus natus laudantium non exercitationem nostrum quibusdam sequi
        commodi, deleniti quaerat animi eveniet, alias id quam. Ipsam necessitatibus magnam rem asperiores et ea facilis
        esse voluptas distinctio autem, fuga earum minima natus, adipisci assumenda cupiditate eveniet soluta quaerat
        molestias hic iusto! At, ex! Odio ratione labore voluptas autem ut dignissimos at qui tenetur, excepturi esse
        dolores in praesentium nostrum quo porro iure ab eum voluptatibus. Cupiditate veritatis accusamus itaque
        pariatur, ut corrupti soluta vel rem quisquam dolore fuga eos porro similique quae quia. Quas velit odit quae
        debitis, rerum incidunt veritatis. Quam amet distinctio quidem dicta. Temporibus officiis praesentium nobis
        cumque eum quasi tenetur rerum dolores provident tempora quas dolorem ab quod itaque hic, iste impedit. Quam
        quaerat odio quidem incidunt veniam corporis tempora reiciendis consequuntur autem. Nemo iusto molestiae,
        temporibus consequuntur deleniti ipsa architecto saepe dolor at nostrum accusamus sequi natus reprehenderit ex,
        animi a tempora quaerat non eius, doloribus corrupti eligendi. Commodi, ut alias, soluta omnis nisi laudantium
        corporis sapiente molestias dolores quibusdam libero vitae.
      </div>
    </>
  );
};

export default {
  decorators: [
    (Component) => (
      <StrictMode>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </StrictMode>
    ),
  ],
} satisfies StoryDefault;
