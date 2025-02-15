import React, { useState, useEffect } from 'react';
import './CreateContractForm.css';
import { formatNumberWithDots } from '../utils/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

function CreateContractForm() {
    const [formData, setFormData] = useState({
      tenantName: '',
      tenantIdNumber: '',
      tenantIdIssuePlace: '',
      flatNumber: '',
      contractDurationInNumbers: '',
      initialDateNumber: '',
      rentalFee: '',
      rentalFeeNumber: '',
      payDayNumber: '',
      payLimitDayNumber: '',
      accountType: '',
      bankName: '',
      accountName: '',
      numberOfTenantsInNumbers: '',
      signingDate: '',
      // Continúa agregando campos para cada atributo del JSON
    });

    const [initialDate, setInitialDate] = useState(new Date());
    const [signingDate, setSigningDate] = useState(new Date());

    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const response = await fetch('http://localhost:8080/apartments/occupied/false');
                if (!response.ok) {
                    throw new Error('Error al cargar los apartamentos');
                }
                const data = await response.json();
                setApartments(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchApartments();
    }, []);

    const navigate  = useNavigate();
    const handleBackClick = () => {
        navigate('/'); // Redirige a la página inicial
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        let flatNumberOnly = formData.flatNumber;
        if (formData.flatNumber && formData.flatNumber.includes("Apto:")) {
            flatNumberOnly = formData.flatNumber.split(",")[0].split(":")[1].trim();
        }
    
        let rentalFeeWithSuffix = formData.rentalFee.trim();
        if (!rentalFeeWithSuffix.endsWith("MIL PESOS")) {
            rentalFeeWithSuffix += " MIL PESOS";
        }
    
        const contractData = {
            tenant: {
                name: formData.tenantName,
                idNumber: formData.tenantIdNumber,
                idIssuePlace: formData.tenantIdIssuePlace
            },
            apartment: {
                flatNumber: flatNumberOnly
            },
            contractDurationInNumbers: formData.contractDurationInNumbers,
            initialDateNumber: initialDate.getDate().toString(),
            initialMonth: initialDate.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
            initialYear: initialDate.getFullYear().toString(),
            rentalFee: rentalFeeWithSuffix,
            rentalFeeNumber: formData.rentalFeeNumber,
            payDayNumber: formData.payDayNumber,
            payLimitDayNumber: formData.payLimitDayNumber,
            accountType: formData.accountType,
            bankName: formData.bankName,
            accountName: formData.accountName,
            numberOfTenantsInNumbers: formData.numberOfTenantsInNumbers,
            signingDayNumber: signingDate.getDate().toString(),
            signingMonth: signingDate.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
            signingYear: signingDate.getFullYear().toString()
        };
    
        try {
            const response = await fetch('http://localhost:8080/contracts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contractData),
            });
    
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
    
            const responseMessage = await response.text();
    
            // Mostrar alerta con el mensaje del backend y resumen del contrato
            alert(`✅ ${responseMessage}\n\n📜 Resumen del Contrato:\n👤 Inquilino: ${formData.tenantName}\n🏠 Apartamento: ${flatNumberOnly}\n💰 Canon de arrendamiento: ${rentalFeeWithSuffix}`);
    
            // **Resetea el formulario después de crear el contrato**
            setFormData({
                tenantName: '',
                tenantIdNumber: '',
                tenantIdIssuePlace: '',
                flatNumber: '',
                contractDurationInNumbers: '',
                initialDateNumber: '',
                rentalFee: '',
                rentalFeeNumber: '',
                payDayNumber: '',
                payLimitDayNumber: '',
                accountType: '',
                bankName: '',
                accountName: '',
                numberOfTenantsInNumbers: '',
                signingDate: ''
            });
    
            // **Resetea las fechas a la fecha actual**
            setInitialDate(new Date());
            setSigningDate(new Date());
    
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert(`❌ Error al crear el contrato: ${error.message}`);
        }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div className='section'>
            <h2>Datos del Inquilino</h2>
            <div className='input-group'>
                <label htmlFor="tenantName">Nombre:</label>
                <input
                    type="text"
                    id="tenantName"
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    placeholder="Nombre"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="tenantIdNumber">Cedula:</label>
                <input
                    type="text"
                    id="tenantIdNumber"
                    value={formData.tenantIdNumber}
                    onChange={(e) => setFormData({ ...formData, tenantIdNumber: formatNumberWithDots(e.target.value) })}
                    placeholder="Cedula"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="tenantIdIssuePlace">Lugar expedicion documento:</label>
                <input
                    type="text"
                    id="tenantIdIssuePlace"
                    value={formData.tenantIdIssuePlace}
                    onChange={(e) => setFormData({ ...formData, tenantIdIssuePlace: e.target.value })}
                    placeholder="Lugar expedicion documento"
                />
            </div>
        </div>
        <div className='section'>
            <h2>Datos del apartamento</h2>
            <div className='input-group'>
                <label htmlFor="flatNumber">Numero apartamento:</label>
                <select
                        id="flatNumber"
                        value={formData.flatNumber}
                        onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                    >
                        <option value="">Selecciona un apartamento</option>
                        {apartments.map(apartment => (
                            <option key={apartment.id} value={apartment.flatNumber}>
                                Apto: {apartment.flatNumber}, cuenta con: {apartment.inventory}
                            </option>
                        ))}
                    </select>
            </div>
        </div>
        <div className='section'>
            <h2>Datos del contrato</h2>
            <div className='input-group'>
                <label htmlFor="contractDurationInNumbers">Duracion contrato (En numero):</label>
                <input
                    type="text"
                    id="contractDurationInNumbers"
                    value={formData.contractDurationInNumbers}
                    onChange={(e) => setFormData({ ...formData, contractDurationInNumbers: e.target.value })}
                    placeholder="Duracion contrato"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="initialDateNumber">Fecha de inicio:</label>
                <DatePicker
                    selected={initialDate}
                    onChange={(date) => setInitialDate(date)}
                />
            </div>
            <div className="input-wrapper rental-fee-wrapper">
                <div className="input-group">
                    <label htmlFor="rentalFee">Canon en letras (valor en miles de pesos):</label>
                    <input
                        type="text"
                        id="rentalFee"
                        value={formData.rentalFee}
                        onChange={(e) =>
                            setFormData({ ...formData, rentalFee: e.target.value })
                        }
                        placeholder="Canon en letras"
                        />
                </div>
                <small className="tip-text">
                    Ejemplo: si deseas escribir 900.000 en letras, solo escribe &quot;NOVECIENTOS&quot;.
                </small>
            </div>

            <div className='input-group'>
                <label htmlFor="rentalFeeNumber">Canon en numeros:</label>
                <input
                    type="text"
                    id="rentalFeeNumber"
                    value={formData.rentalFeeNumber}
                    onChange={(e) => setFormData({ ...formData, rentalFeeNumber: formatNumberWithDots(e.target.value) })}
                    placeholder="Canon en numeros"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="payDayNumber">Dia de pago:</label>
                <input
                    type="text"
                    id="payDayNumber"
                    value={formData.payDayNumber}
                    onChange={(e) => setFormData({ ...formData, payDayNumber: e.target.value })}
                    placeholder="Dia de pago"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="payLimitDayNumber">Dia maximo de pago:</label>
                <input
                    type="text"
                    id="payLimitDayNumber"
                    value={formData.payLimitDayNumber}
                    onChange={(e) => setFormData({ ...formData, payLimitDayNumber: e.target.value })}
                    placeholder="Dia maximo de pago"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="accountType">Tipo cuenta:</label>
                <input
                    type="text"
                    id="accountType"
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    placeholder="Tipo cuenta"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="bankName">Banco:</label>
                <input
                    type="text"
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Banco"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="accountName"># Cuenta:</label>
                <input
                    type="text"
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    placeholder="# Cuenta"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="numberOfTenantsInNumbers"># Inquilinos:</label>
                <input
                    type="text"
                    id="numberOfTenantsInNumbers"
                    value={formData.numberOfTenantsInNumbers}
                    onChange={(e) => setFormData({ ...formData, numberOfTenantsInNumbers: e.target.value })}
                    placeholder="# Inquilinos"
                />
            </div>
            <div className='input-group'>
                <label htmlFor="signingDate">Fecha de firma:</label>
                <DatePicker
                    selected={signingDate}
                    onChange={(date) => setSigningDate(date)}
                />
            </div>
        </div>
        {/* Continúa agregando inputs para cada campo */}
        <button type="submit">Crear Contrato</button>
        <button type="button" onClick={handleBackClick}>Volver</button>
      </form>
    );
  }
  
  export default CreateContractForm;
