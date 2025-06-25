"use client";
import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

export default function FullCalendar({ onDateSelect, setMessage }) {
  const calendarRef = useRef(null);
  const calendarApiRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      locale: ptBrLocale,
      initialView: "dayGridMonth",
      selectable: true,
      headerToolbar: {
        left: "title",
        center: "",
        right: "prev,next",
      },
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5],
      },
      dateClick: function (info) {
        const clickedDate = info.date;
        const dayOfWeek = clickedDate.getDay();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setMessage("Agendamento disponível apenas em dias úteis (segunda a sexta)");
          return;
        }

        if (clickedDate < today) {
          setMessage("Não é possível agendar para datas passadas");
          return;
        } else {
          setMessage("");
        }

        setSelectedDate(info.dateStr);
        onDateSelect(info.dateStr);


        const calendarApi = calendarApiRef.current;
        if (calendarApi) {
          const currentViewDate = calendarApi.getDate();
          if (
            clickedDate.getMonth() !== currentViewDate.getMonth() ||
            clickedDate.getFullYear() !== currentViewDate.getFullYear()
          ) {
            calendarApi.gotoDate(clickedDate);
          }
        }
      },

      dayCellClassNames: function (arg) {
        const dateStr = arg.date.toISOString().split("T")[0];
        if (selectedDate === dateStr) {
          return ["selected-day"];
        }

        const day = arg.date.getDay();
        const today = new Date();
        today.setHours(0,0,0,0);
        if (day === 0 || day === 6 || arg.date < today) {
          return ["fc-day-disabled"];
        }
        return [];
      },
    });

    calendar.render();
    calendarApiRef.current = calendar;

    return () => calendar.destroy();
  }, []);

  useEffect(() => {
    if (calendarApiRef.current) {
      calendarApiRef.current.setOption("dayCellClassNames", (arg) => {
        const dateStr = arg.date.toISOString().split("T")[0];
        if (selectedDate === dateStr) {
          return ["selected-day"];
        }
        const day = arg.date.getDay();
        const today = new Date();
        today.setHours(0,0,0,0);
        if (day === 0 || day === 6 || arg.date < today) {
          return ["fc-day-disabled"];
        }
        return [];
      });
    }
  }, [selectedDate]);

  return (
    <div
      ref={calendarRef}
      className="w-[90%] text-center font-semibold text-xs"
    />
  );
}