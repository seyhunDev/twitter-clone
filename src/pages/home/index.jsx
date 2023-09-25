import React, { useState } from 'react';

function App() {
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [formData, setFormData] = useState({
        word: '',
    });

    const changeHandle = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const submitHandle = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch('http://localhost:3000/create-sentence', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res?.error) {
                    // Handle error if needed
                } else {
                    setComments([...comments, res]);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOrderClick = (list, meaning, index) => {
        const orderData = {
            list,
            meaning,
        };

        fetch('http://localhost:3000/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);

                if (result && result.message) {
                    // Handle success message if needed
                }
            })
            .catch((error) => {
                console.error('Sipariş oluşturma hatası:', error);
            });

        setSelectedOrder(orderData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCheckboxChange = (index, checkboxIndex) => {
        // Checkbox değiştiğinde burada işlem yapabilirsiniz.
        console.log(`Checkbox ${index}-${checkboxIndex} değişti`);
    };

    const removeCheckedItems = (index) => {
        // İşaretli olan checkbox'ları listeden kaldırın
        const updatedComments = [...comments];
        updatedComments[index].list = updatedComments[index].list.filter((_, i) => {
            const checkbox = document.getElementById(`checkbox-${index}-${i}`);
            return !checkbox.checked;
        });

        setComments(updatedComments);
    };

    return (
        <div className="container">
            <div className="input">
                <form onSubmit={submitHandle} className="form">
                    <input
                        type="text"
                        onChange={changeHandle}
                        value={formData.word}
                        name="word"
                        placeholder="food, recipe, vegetables ..."
                        className="input-in"
                    />
                    <button
                        disabled={Object.values(formData).some(
                            (value) => !value || value.trim() === '' || loading
                        )}
                        className="submit-btn"
                    >
                        {loading ? '...' : 'find'}
                    </button>
                </form>
            </div>
            <div className='answers-container'>
                {comments.length > 0 && (
                    <div className="answer">
                        {comments.slice().reverse().map(({ time, link, count, list, meaning, sentence, word }, index) => (
                            <section key={index} className="section">
                                <header className="header">
                                    <h6 className='meaning'>{meaning}</h6>
                                </header>
                                <header className="headerTwo">
                                    <div className='time'>🕓 {time} min. - {count} person</div>
                                </header>
                                <div className="headerTwo">
                                    <div className='link'>You'll need a {link}</div>
                                </div>
                                <div className="sentences">
                                    {sentence.map((s, i) => (
                                        <p key={i} className="sentence-text">
                                            {s}
                                        </p>
                                    ))}
                                </div>
                                <button className='order-now' onClick={() => handleOrderClick(list, meaning, index)}>
                                    order now
                                </button>
                            </section>
                        ))}
                    </div>
                )}
                <div className="sidebar-right">
                    {isModalOpen && selectedOrder && (
                        <div className="modal">
                            <div className="modal-content">
                                <h4>Your order has been sent!</h4>
                                <ul>
                                    {selectedOrder.list.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                                <span className="close" onClick={closeModal}>&times;</span>
                            </div>
                        </div>
                    )}
                    <div className='rigt-list-container'>
                        {comments.length > 0 && (
                            <div className="list-container">
                                {comments.slice().reverse().map(({ list, meaning }, index) => (
                                    <section key={index} className="list-section">
                                        <header className="">
                                            <h5>{meaning}</h5>
                                            <div className=''>
                                                <ul>
                                                    {list.map((s, i) => (
                                                        <li key={i} className="">
                                                            <input
                                                                type="checkbox"
                                                                id={`checkbox-${index}-${i}`}
                                                                onChange={() => handleCheckboxChange(index, i)}
                                                            />
                                                            <label htmlFor={`checkbox-${index}-${i}`}>{s}</label>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    className='order-now'
                                                    onClick={() => {
                                                        handleOrderClick(
                                                            list.filter((s, i) => {
                                                                const checkbox = document.getElementById(`checkbox-${index}-${i}`);
                                                                return !checkbox.checked;
                                                            }),
                                                            meaning,
                                                            index
                                                        );

                                                        removeCheckedItems(index); // İşaretli olanları kaldır
                                                    }}
                                                >
                                                    order now
                                                </button>
                                            </div>
                                        </header>
                                    </section>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default App;
