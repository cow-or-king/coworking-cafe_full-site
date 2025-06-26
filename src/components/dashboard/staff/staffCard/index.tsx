import { Card } from "@/components/ui/card";

import { useTypedDispatch } from "@/store/types";
import * as React from "react";
import toast from "react-hot-toast";
import StaffCardFooter from "./staffCardFooter";
import StaffCardHeader from "./staffCardHeader";

type StaffCardProps = {
  firstname: string;
  lastname: string;
  start: string;
  end: string;
};

export default function StaffCard({
  firstname,
  lastname,
  start,
  end,
}: StaffCardProps) {
  const dispatch = useTypedDispatch();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    date: new Date().toISOString().slice(0, 10),
    start: start || "",
    end: end || "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newShift = addStaffShift({
        id: "",
        firstname,
        lastname,
        ...form,
      });
      dispatch(addShiftAction(newShift));
      toast.success("Horaires enregistrés !");
      setOpen(false);
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="@container/card cursor-pointer">
      <StaffCardHeader firstname={firstname} lastname={lastname} start={true} />
      <StaffCardFooter start={start} end={end} />
    </Card>
  );
}
function addStaffShift(arg0: {
  date: string;
  start: string;
  end: string;
  id: string;
  firstname: string;
  lastname: string;
}) {
  throw new Error("Function not implemented.");
}

function addShiftAction(newShift: void): any {
  throw new Error("Function not implemented.");
}
