// pages/SchoolSuppliesReport.js
import React, { useEffect, useContext, useState } from 'react';
import Layout from "../components/layout/Layout";
import styles from "./css/SchoolSuppliesReport.module.scss";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesActiveAction } from "../components/redux/actions/EmployeeActions";

// Auth (para gatear si no hay usuario)
import FirebaseContext from "../firebase/context";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7f50',
  '#8dd1e1', '#a4de6c', '#d0ed57', '#d88884'
];

const SchoolSuppliesReport = () => {
  const [dataKit, setDataKit] = useState([]);
  const [dataGuardapolvo, setDataGuardapolvo] = useState([]);
  const [dataPie, setDataPie] = useState([]);

  const employeesSelector = useSelector(state => state.employees.employees);
  const dispatch = useDispatch();

  // user para redirigir si no hay auth (según tus reglas)
  const { user } = useContext(FirebaseContext);

  // Si tu action ya usa el SDK modular internamente, no necesita param
  useEffect(() => {
    dispatch(getEmployeesActiveAction());
  }, [dispatch]);

  // Gateo simple (mantené tu lógica si usás router)
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  // ---- Helpers de agregación (misma idea que tenías) ----
  const buildBarDataFromCounts = (objCounts) =>
    Object.keys(objCounts).filter(k => k !== 'null' && k !== 'undefined').map((k, idx) => ({
      name: k,
      value: objCounts[k]
    }));

  const getGuardapolvoData = () => {
    // Cuenta por talle (último registro por familiar en el año actual)
    const currentYear = new Date().getFullYear();
    const bySize = {};

    employeesSelector.forEach(emp => {
      (emp.familia || []).forEach(fam => {
        const last = (fam.talle || [])[ (fam.talle || []).length - 1 ];
        if (last && last.numero && last.anio === currentYear) {
          const key = String(last.numero);
          bySize[key] = (bySize[key] || 0) + 1;
        }
      });
    });

    setDataGuardapolvo(buildBarDataFromCounts(bySize));
  };

  const getKitData = () => {
    // Cuenta por tipo de kit (último registro por familiar en el año actual)
    const currentYear = new Date().getFullYear();
    const byKit = {};

    employeesSelector.forEach(emp => {
      (emp.familia || []).forEach(fam => {
        const last = (fam.kit_escolar || [])[ (fam.kit_escolar || []).length - 1 ];
        if (last && last.tipo && last.anio === currentYear) {
          const key = String(last.tipo);
          byKit[key] = (byKit[key] || 0) + 1;
        }
      });
    });

    setDataKit(buildBarDataFromCounts(byKit));
  };

  const getDeliveredData = () => {
    const currentYear = new Date().getFullYear();
    let entregados = 0;
    let sinEntregar = 0;

    employeesSelector.forEach(emp => {
      const e = emp.entregado;
      if (e && typeof e === 'object' && e.anio === currentYear) {
        if (e.checked) entregados += 1;
        else sinEntregar += 1;
      }
    });

    setDataPie([
      { name: 'Entregados', value: entregados },
      { name: 'Sin Entregar', value: sinEntregar }
    ]);
  };

  useEffect(() => {
    if (!employeesSelector || employeesSelector.length === 0) {
      setDataGuardapolvo([]);
      setDataKit([]);
      setDataPie([]);
      return;
    }
    getGuardapolvoData();
    getKitData();
    getDeliveredData();
  }, [employeesSelector]);

  return (
    <Layout homepage={true}>
      <div className={styles.rowChartBar}>
        <h3>Cantidad de Guardapolvos por Talle</h3>
        <div style={{ height: 320, width: '100%' }} className="mb-4">
          <ResponsiveContainer>
            <BarChart data={dataGuardapolvo} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Guardapolvos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.rowChartBar}>
        <h3>Cantidad de Kits Escolares por Tipo</h3>
        <div style={{ height: 320, width: '100%' }} className="mb-4">
          <ResponsiveContainer>
            <BarChart data={dataKit} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Kits" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.rowChartBar}>
        <h3>Total Entregas</h3>
        <div style={{ height: 320, width: '100%' }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={dataPie}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                label
                isAnimationActive={false}
              >
                {dataPie.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default SchoolSuppliesReport;
