using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestreSzabva.Models
{
    public class EtelKategoria
    {
        [Key, Column(Order = 0)]
        public int FoodId { get; set; }

        [ForeignKey("FoodId")]
        public Etel Etel { get; set; }

        [Key, Column(Order = 1)]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Kategoria Kategoria { get; set; }
    }
}
