import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function List() {
  const [form, setForm] = useState({
    name: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
          `http://localhost:5050/lists/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const list = await response.json();
      if (!list) {
        console.warn(`List with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(list);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const list = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new list we will POST to /list.
        response = await fetch("http://localhost:5050/lists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(list),
        });
      } else {
        // if we are updating a list we will PATCH to /list/:id.
        response = await fetch(`http://localhost:5050/lists/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(list),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({ name: "" });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
      <>
        <h3 className="text-lg font-semibold p-4">Create/Update List</h3>
        <form
            onSubmit={onSubmit}
            className="border rounded-lg overflow-hidden p-4"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold leading-7 text-slate-900">
                List Info
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                This information will be displayed publicly so be careful what you
                share.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
              <div className="sm:col-span-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-slate-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="First Last"
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input
              type="submit"
              value="Save List"
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
          />
        </form>
      </>
  );
}