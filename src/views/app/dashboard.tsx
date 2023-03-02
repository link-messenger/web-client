import { Field, Form, Formik } from 'formik';

import { Button, NormalInput } from 'components';
import { CREATE_ROOM_INITIALS } from 'constants';
import { useCreateRoom } from 'hooks';
import { EN_US } from 'languages';

export const Dashboard = () => {
  const { mutate: createRoom } = useCreateRoom();
  const onCreateRoom = (
    data: typeof CREATE_ROOM_INITIALS,
  ) => {
    createRoom(data);
  };

  return (
    <div className="flex-1">
      <header className="text-3xl p-4 space-y-3 text-gray-700 font-medium">
        <p>{EN_US['dashboard.Dashboard']}</p>
        <hr />
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-6 w-full px-4 gap-3">
        <div className="space-y-3 shadow-md rounded-lg border col-span-2 p-3">
          <h4 className="text-xl text-sky-500">
            {EN_US['dashboard.CreateRoom']}
          </h4>
          <Formik
            initialValues={CREATE_ROOM_INITIALS}
            onSubmit={onCreateRoom}
          >
            <Form className="space-y-3">
              <Field
                as={NormalInput}
                name="name"
                placeholder="enter a name for your room"
                icon={
                  <i className="uil uil-comment-info"></i>
                }
              />
              <Button
                type="submit"
                className="space-x-2"
              >
                <i className="uil uil-outgoing-call text-lg"></i>
                <span>
                  {EN_US['dashboard.Call']}
                </span>
              </Button>
            </Form>
          </Formik>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
