import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const List = (props) => (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
        {props.list.name}
      </td>
      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
        <div className="flex gap-2">
          <Link
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
              to={`/edit/${props.list._id}`}
          >
            Edit
          </Link>
          <button
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
              color="red"
              type="button"
              onClick={() => {
                props.deleteList(props.list._id);
              }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
);

export default function Lists() {
  const [lists, setLists] = useState([]);

  // This method fetches the lists from the database.
  useEffect(() => {
    async function getLists() {
      const response = await fetch(`http://localhost:5050/lists/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const lists = await response.json();
      setLists(lists);
    }
    getLists();
  }, [lists.length]);

  // This method will delete a list
  async function deleteList(id) {
    await fetch(`http://localhost:5050/lists/${id}`, {
      method: "DELETE",
    });
    const newLists = lists.filter((el) => el._id !== id);
    setLists(newLists);
  }

  // This following section will display the table with the todo lists.
  return (
      <>
        <h3 className="text-lg font-semibold p-4">Todo Lists</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
              </thead>
              <tbody className="[&amp;_tr:last-child]:border-0">
              {lists.map((list) => {
                return (
                    <List
                        list={list}
                        deleteList={() => deleteList(list._id)}
                        key={list._id}
                    />
                )
              })}
              </tbody>
            </table>
          </div>
        </div>
      </>
  );
}