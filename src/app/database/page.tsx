export default function Database() {
  return (
    <div className="gap-3">
      <div className="flex flex-row my-3 gap-3">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-white shadow-lg p-5 w-7xl">
            <form>
              <div className="max-w-screen mb-6 gap-6 grid grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-90">
                    Pond
                  </label>
                  <select
                    name="ponds"
                    id="ponds"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Date
                  </label>
                  <input
                    type="number"
                    id="age"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="1"
                    required
                  />
                </div>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="date"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    required
                  />
                </div>
              </div>
              <div className="mb-6 grid grid-cols-3 gap-6">
                <div className="">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Water Temperature
                  </label>
                  <input
                    type="temperature"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="30 C"
                    required
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Salinity
                  </label>
                  <input
                    type="temperature"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="30 C"
                    required
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Turbidity
                  </label>
                  <input
                    type="temperature"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="30 C"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="confirm_password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="•••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="rounded-2xl bg-white shadow-lg p-5"></div>
        </div>
      </div>
    </div>
  );
}
