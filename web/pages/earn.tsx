import { Button } from "../components/Button";
import Layout from "../components/Layout";

const Tasks = () => {
  return (
    <Layout>
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Pay</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Tasks;
