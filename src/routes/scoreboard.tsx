import { drizzle } from "drizzle-orm/d1";
import { C } from "..";
import * as schema from "../schema";

export function PodiumItem(props: {
  place: number;
  customClass: string;
  bomb: schema.Bomb | undefined;
  showNetIds: boolean;
}) {
  return (
    <div
      class={
        "grid grid-cols-[60px_2fr] md:grid-cols-[0.8fr_2fr] lg:grid-cols-[1fr_2fr] overflow-hidden rounded bg-slate-900 text-center " +
        props.customClass
      }
    >
      <div class="flex items-center justify-center bg-rose-500/80 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50 px-5 py-2 flex-grow">
        {props.place}
      </div>
      <div class="flex items-center justify-between md:justify-center text-lg sm:text-xl lg:text-2xl text-slate-100 md:flex-col gap-4 sm:gap-2 lg:gap-3 px-6 py-2 sm:py-3 md:py-4 text-center">
        <span>{props.bomb ? "bomb" + props.bomb.id : "--"}</span>
        {props.bomb &&
          (props.showNetIds ? (
            <span class="text-sm sm:text-base text-slate-400 flex md:flex-col gap-2">
              <span>{props.bomb.netId}</span>
              <span>({props.bomb.score} points)</span>
            </span>
          ) : (
            <span class="text-sm sm:text-base text-slate-400">
              {props.bomb.score} points
            </span>
          ))}
      </div>
    </div>
  );
}

function getPodiumBomb(bombs: schema.Bomb[], index: number) {
  let bomb = bombs[index] as schema.Bomb | undefined;
  if (
    bombs[index] &&
    bombs[index].score === 0 &&
    bombs[index].explosions === 0 &&
    bombs[index].phase === 0
  ) {
    bomb = undefined;
  }
  return bomb;
}

// main scoreboard page with the top 3 bombs and a table of all bombs
export async function scoreboard(c: C) {
  // get the bombs from the database
  const db = drizzle(c.env.DB, { schema });
  const bombs = await db.query.bombs.findMany({
    orderBy: (bombs, { desc, asc }) => [desc(bombs.score), asc(bombs.time)],
  });

  // get the top 3 bombs
  const first = getPodiumBomb(bombs, 0);
  const second = getPodiumBomb(bombs, 1);
  const third = getPodiumBomb(bombs, 2);

  // get the showNetIds query param from the url if it exists
  const { searchParams } = new URL(c.req.url);
  const showNetIds = searchParams.get("netid") === "true";

  const cols = showNetIds
    ? "grid grid-cols-[2rem_3.5rem_4rem_4rem_6rem_7rem] sm:grid-cols-[3rem_5rem_6rem_6rem_8rem_9rem] md:grid-cols-[4rem_6rem_7rem_7rem_10rem_12rem] lg:grid-cols-[6rem_9rem_10rem_9rem_12rem_15rem] items-center"
    : "grid grid-cols-[2rem_3.5rem_4rem_6rem_7rem] sm:grid-cols-[3rem_5rem_6rem_8rem_9rem] md:grid-cols-[4rem_6rem_7rem_10rem_12rem] lg:grid-cols-[6rem_9rem_9rem_12rem_15rem] items-center";

  // render the scoreboard page UI
  return c.render(
    <div class="absolute inset-0 flex flex-col">
      <div class="flex-grow">
        {/* header */}
        <div class="flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between bg-slate-100 px-6 py-6 sm:px-9 md:px-12 md:py-8 lg:px-16 lg:py-10">
          <div class="grid gap-3">
            <h2 class="flex items-center gap-3 sm:text-lg font-medium">
              <span class="text-slate-600">CPSC 323</span>
              <div class="h-5 w-0.5 rounded-full bg-slate-300"></div>
              <span class="text-rose-600">Bomb Lab</span>
            </h2>
            <h1 class="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Scoreboard
            </h1>
          </div>
          <div class="text-sm md:text-base sm:w-1/2 leading-normal text-slate-600">
            This page contains the latest information that we have received from
            your bomb. If you have any questions, please contact the course
            staff on Ed Discussion or by email.
          </div>
        </div>
        {/* podium */}
        <div class="grid md:grid-cols-3 items-end gap-3 sm:gap-5 md:gap-8 lg:gap-12 p-4 sm:p-8 md:p-12 lg:p-16 mt-4">
          {/* first */}
          <PodiumItem
            place={1}
            customClass="md:h-60 md:order-2"
            bomb={first}
            showNetIds={showNetIds}
          />
          {/* second */}
          <PodiumItem
            place={2}
            customClass="md:h-48 md:order-1"
            bomb={second}
            showNetIds={showNetIds}
          />
          {/* third */}
          <PodiumItem
            place={3}
            customClass="md:h-36 md:order-3"
            bomb={third}
            showNetIds={showNetIds}
          />
        </div>
        {/* results */}
        {bombs.length > 0 ? (
          <div class="grid gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 px-4 sm:px-8 md:px-12 lg:px-16 pb-8 sm:pb-10 md:pb-12 lg:pb-16 pt-2 sm:pt-3 md:pt-4 overflow-x-scroll">
            <div class="flex items-center justify-between gap-3 px-1 text-slate-50 p-2">
              <div class={cols}>
                <div class="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-slate-600">
                  #
                </div>
                <div class="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-slate-600">
                  Bomb
                </div>
                {showNetIds && (
                  <div class="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-slate-600">
                    NetID
                  </div>
                )}
                <div class="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-slate-600">
                  Phase
                </div>
                <div class="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-slate-600">
                  Explosions
                </div>
                <div class="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-slate-600">
                  Submission Time
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-slate-600">
                  Score
                </div>
              </div>
            </div>
            <div class="h-px w-full rounded-lg bg-slate-700"></div>
            {bombs.map((bomb, index) => (
              <>
                <div
                  id={"bomb" + bomb.id}
                  class="flex items-center justify-between gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 px-1 py-1 text-xs sm:text-sm md:text-base lg:text-lg text-slate-50"
                >
                  <div class={cols}>
                    <div class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-500">
                      {index + 1}
                    </div>
                    <div>bomb{bomb.id}</div>
                    {showNetIds && (
                      <div class="text-slate-400">{bomb.netId}</div>
                    )}
                    <div class="flex items-center gap-1 font-medium">
                      {bomb.phase === 10 ? (
                        <span class="text-green-400">10</span>
                      ) : (
                        <span class="text-blue-400">{bomb.phase}</span>
                      )}
                      <span class="text-slate-600">/</span>
                      <span class="text-slate-600">10</span>
                    </div>
                    {bomb.explosions === 0 ? (
                      <div class="font-medium text-slate-600">None</div>
                    ) : (
                      <div class="font-medium text-pink-400">
                        {bomb.explosions}
                      </div>
                    )}
                    <div class="text-xs sm:text-sm lg:text-base text-slate-400">
                      {bomb.phase > 0 || bomb.explosions > 0 || bomb.score !== 0
                        ? bomb.time.toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            hour12: true,
                            hour: "numeric",
                            minute: "numeric",
                            timeZone: "America/New_York",
                          })
                        : "--"}
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-base sm:text-lg md:text-lg lg:text-xl font-bold text-rose-500">
                      {bomb.score}
                    </div>
                  </div>
                </div>
                <div class="h-px w-full rounded-lg bg-slate-700"></div>
              </>
            ))}
          </div>
        ) : (
          <div class="flex h-32 items-center justify-center text-2xl font-medium text-slate-400">
            No bombs have been created yet.
          </div>
        )}
      </div>
      {/* footer */}
      <div class="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-5 px-8 lg:px-16 py-6 border-t border-t-slate-700 bg-slate-900/30 text-slate-400 text-xs md:text-sm">
        <div>
          Bomb Lab Server by{" "}
          <a
            href="https://github.com/joshdchang"
            target="_blank"
            class="text-rose-500 hover:text-rose-400 underline underline-offset-2"
          >
            Josh Chang
          </a>
        </div>
        <div>
          Last updated:{" "}
          <span class="text-slate-500">
            {new Date().toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              hour12: true,
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              timeZone: "America/New_York",
            })}
          </span>
        </div>
        <div>&copy; {new Date().getFullYear()} Yale University</div>
      </div>
    </div>,
    { title: "CPSC 323 | Bomb Lab Scoreboard" }
  );
}
