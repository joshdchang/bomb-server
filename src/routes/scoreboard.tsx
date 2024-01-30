import { drizzle } from "drizzle-orm/d1";
import { C } from "..";
import * as schema from "../schema";

export async function scoreboard(c: C) {
  // get the bombs from the database
  const db = drizzle(c.env.DB, { schema });
  const bombs = await db.query.bombs.findMany({
    orderBy: (bombs, { desc, asc }) => [desc(bombs.score), asc(bombs.time)],
  });

  // get the top 3 bombs
  let first = bombs[0] as schema.Bomb | undefined;
  if (
    first &&
    first.score === 0 &&
    first.explosions === 0 &&
    first.phase === 0
  ) {
    first = undefined;
  }
  let second = bombs[1] as schema.Bomb | undefined;
  if (
    second &&
    second.score === 0 &&
    second.explosions === 0 &&
    second.phase === 0
  ) {
    second = undefined;
  }
  let third = bombs[2] as schema.Bomb | undefined;
  if (
    third &&
    third.score === 0 &&
    third.explosions === 0 &&
    third.phase === 0
  ) {
    third = undefined;
  }

  // get the showNetIds query param from the url if it exists
  const { searchParams } = new URL(c.req.url);
  const showNetIds = searchParams.get("netid") === "true";

  // render the scoreboard page UI
  return c.render(
    <div class="min-h-screen flex flex-col">
      <div class="flex-grow">
        {/* header */}
        <div class="flex items-center justify-between bg-slate-100 px-16 py-10">
          <div class="grid gap-3">
            <h2 class="flex items-center gap-3 text-lg font-medium">
              <span class="text-slate-600">CPSC 323</span>
              <div class="h-5 w-0.5 rounded-full bg-slate-300"></div>
              <span class="text-rose-600">Bomb Lab</span>
            </h2>
            <h1 class="font-mono text-3xl font-bold text-slate-900">
              Scoreboard
            </h1>
          </div>
          <div class="w-1/2 leading-normal text-slate-600">
            This page contains the latest information that we have received from
            your bomb. If you have any questions, please contact the course
            staff on Ed Discussion or by email.
          </div>
        </div>
        {/* podium */}
        <div class="grid grid-cols-3 items-end gap-12 p-16">
          {/* second */}
          <div class="grid h-44 grid-cols-[1fr_2fr] overflow-hidden rounded bg-slate-900">
            <div class="flex items-center justify-center bg-rose-500/80 text-5xl font-bold text-slate-50">
              2
            </div>
            <div class="flex items-center justify-center text-2xl text-slate-100 flex-col gap-3">
              <span>{second ? "bomb" + second.id : "--"}</span>
              {second &&
                (showNetIds ? (
                  <span class="text-base text-slate-400">
                    {second.netId} ({second.score} points)
                  </span>
                ) : (
                  <span class="text-base text-slate-400">
                    {second.score} points
                  </span>
                ))}
            </div>
          </div>
          {/* first */}
          <div class="grid h-60 grid-cols-[1fr_2fr] overflow-hidden rounded bg-slate-900">
            <div class="flex items-center justify-center bg-rose-500/80 text-5xl font-bold text-slate-50">
              1
            </div>
            <div class="flex items-center justify-center text-2xl text-slate-100 flex-col gap-3">
              <span>{first ? "bomb" + first.id : "--"}</span>
              {first &&
                (showNetIds ? (
                  <span class="text-base text-slate-400">
                    {first.netId} ({first.score} points)
                  </span>
                ) : (
                  <span class="text-base text-slate-400">
                    {first.score} points
                  </span>
                ))}
            </div>
          </div>
          {/* third */}
          <div class="grid h-32 grid-cols-[1fr_2fr] overflow-hidden rounded bg-slate-900">
            <div class="flex items-center justify-center bg-rose-500/80 text-5xl font-bold text-slate-50">
              3
            </div>
            <div class="flex items-center justify-center text-2xl text-slate-100 flex-col gap-3">
              <span>{third ? "bomb" + third.id : "--"}</span>
              {third &&
                (showNetIds ? (
                  <span class="text-base text-slate-400">
                    {third.netId} ({third.score} points)
                  </span>
                ) : (
                  <span class="text-base text-slate-400">
                    {third.score} points
                  </span>
                ))}
            </div>
          </div>
        </div>
        {/* results */}
        {bombs.length > 0 ? (
          <div class="grid gap-2 px-16 pb-16 pt-4">
            <div class="flex items-center justify-between gap-3 px-1 text-lg text-slate-50">
              <div
                class={
                  showNetIds
                    ? "grid grid-cols-[6rem_9rem_10rem_9rem_12rem_16rem] items-center"
                    : "grid grid-cols-[6rem_9rem_9rem_12rem_16rem] items-center"
                }
              >
                <div class="text-2xl font-medium text-slate-600">#</div>
                <div class="text-lg font-medium text-slate-600">Bomb</div>
                {showNetIds && (
                  <div class="text-lg font-medium text-slate-600">NetID</div>
                )}
                <div class="text-lg font-medium text-slate-600">Phase</div>
                <div class="text-lg font-medium text-slate-600">Explosions</div>
                <div class="text-lg font-medium text-slate-600">
                  Submission Time
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-lg font-medium text-slate-600">Score</div>
              </div>
            </div>
            <div class="h-px w-full rounded-lg bg-slate-700"></div>
            {bombs.map((bomb, index) => (
              <>
                <div
                  id={"bomb" + bomb.id}
                  class="flex items-center justify-between gap-3 px-1 py-1 text-lg text-slate-50"
                >
                  <div
                    class={
                      showNetIds
                        ? "grid grid-cols-[6rem_9rem_10rem_9rem_12rem_16rem] items-center"
                        : "grid grid-cols-[6rem_9rem_9rem_12rem_16rem] items-center"
                    }
                  >
                    <div class="text-3xl font-bold text-slate-500">
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
                    <div class="text-base text-slate-400">
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
                    <div class="text-xl font-bold text-rose-500">
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
      <div class="flex items-center justify-between gap-3 px-16 py-6 border-t border-t-slate-700 bg-slate-900/30 text-slate-400 text-sm">
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
