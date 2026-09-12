import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const PRO_FAQ_ITEMS = [
  {
    question: "Quel est le délai exact de vérification et d'activation de mon compte PRO ?",
    answer: "Une fois votre pièce d'identité (ou RCCM d'agence) déposée, notre équipe de conformité procède aux vérifications sous un délai maximum de 24 à 48 heures ouvrées. Vous recevez une confirmation par SMS et email dès l'activation effective de votre badge officiel."
  },
  {
    question: "Comment fonctionnent la facturation et le paiement mensuel de mon forfait ?",
    answer: "Le règlement de votre abonnement (15 000 FCFA ou 35 000 FCFA) s'effectue simplement et directement par Mobile Money (Wave, Orange Money, MTN, Airtel) ou carte bancaire. Vous recevez automatiquement un reçu officiel certifié pour votre comptabilité."
  },
  {
    question: "Quels justificatifs sont requis pour valider mon profil professionnel ?",
    answer: "Pour les démarcheurs indépendants, une pièce d'identité officielle en cours de validité (CNI ou passeport) est demandée. Pour les agences immobilières et cabinets, un extrait de registre du commerce (RCCM) est requis pour activer la vitrine d'agence certifiée."
  },
  {
    question: "Puis-je changer de forfait ou résilier à tout moment ?",
    answer: "Absolument. Nos offres sont sans aucun engagement de durée. Vous pouvez basculer d'un forfait STARTER à un forfait PRO, ou suspendre votre abonnement mensuel à tout moment depuis votre tableau de bord en un clic."
  },
  {
    question: "Comment fonctionne l'option « Mise en avant » offerte chaque mois ?",
    answer: "Chaque mois, vos crédits de mise en avant vous permettent d'épingler le bien de votre choix en tête des listes de recherche et dans le carrousel vedette de la page d'accueil, multipliant son audience par cinq en moyenne."
  }
];

export const ProFaq = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-faq">
      <div className="habitoo-pro-container">
        
        <div className="faq-header">
          <span className="faq-tag">FAQ PROFESSIONNELS</span>
          <h2 className="faq-title">Questions fréquentes</h2>
          <p className="faq-subtitle">
            Tout ce que vous devez savoir pour rejoindre et développer votre activité sur le réseau Habitoo PRO.
          </p>
        </div>

        <div className="faq-list">
          {PRO_FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-icon-indicator">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
