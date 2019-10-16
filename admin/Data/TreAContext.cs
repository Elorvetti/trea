using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.AspNetCore.Identity;

namespace admin.Data
{
    public class TreAContext: IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public TreAContext(DbContextOptions<TreAContext> o ) : base(o) {}
        public virtual DbSet<Administrator> administrator { get; set; }
  
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder){
            optionsBuilder
                .ConfigureWarnings(warnings => 
                    warnings.Throw(RelationalEventId.QueryClientEvaluationWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Administrator>(entity => {

                entity.HasKey(e => e.id);
                entity.Property(e => e.user);
                entity.Property(e => e.password); 
                entity.Property(e => e.IsActive);
                entity.Property(e => e.rememberMe);
            });

        }

    }
}