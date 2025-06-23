"use client";
import React, { useRef, useEffect } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

export default function FullCalendar({ onDateSelect, setMessage}) {
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      locale: ptBrLocale,
      initialView: "dayGridMonth",
      selectable: true,
      headerToolbar: {
        left: 'title',
        center: '',
        right: 'prev,next'
  },
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], 
      },
      dateClick: function (info) {
        const clickedDate = info.date;
        const dayOfWeek = clickedDate.getDay();
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          alert("Agendamento disponível apenas em dias úteis (segunda a sexta)");
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (clickedDate < today) {
          setMessage("Não é possível agendar para datas passadas");
          return;
        } else {
          setMessage("")
        }

        onDateSelect(info.dateStr);
      },
      dayCellClassNames: function(arg) {
        if (arg.date.getDay() === 0 || arg.date.getDay() === 6 || arg.date < new Date()) {
          return ['fc-day-disabled'];
        }
      }
    });

    calendar.render();

    return () => calendar.destroy();
  }, [onDateSelect]);
  return <div ref={calendarRef} className="w-[90%] text-center font-semibold text-xs"/>;
}